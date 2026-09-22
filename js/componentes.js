/* =========================================================
   COMPONENTES — badges, alertas e toast (inclui a cópia do Pix)
   Os elementos que esses componentes tocam (o toast) fazem parte
   do "casco" fixo do SPA (index.html), fora de #app, por isso os
   listeners aqui são registrados uma única vez. O botão de copiar
   Pix, porém, só existe quando a rota "doacao" está renderizada
   dentro de #app — por isso o clique é ouvido por delegação em
   document, o que funciona não importa quantas vezes #app mude.
   ========================================================= */
window.ONG = window.ONG || {};

window.ONG.componentes = (function () {
    "use strict";

    const armazenamento = window.ONG.armazenamento;
    const CHAVE_FAVORITOS = "projetos-favoritos";

    let toastTimer;
    let toastFecharRegistrado = false;
    let pixDelegacaoRegistrada = false;
    let favoritosDelegacaoRegistrada = false;

    function badgeHTML(texto, classe) {
        return `<span class="badge ${classe}">${texto}</span>`;
    }

    function alertaHTML(tipo, texto, atributosExtra) {
        return `<p class="alerta alerta-${tipo}"${atributosExtra || ""}>${texto}</p>`;
    }

    function elementosToast() {
        const toast = document.querySelector("[data-toast]");
        if (!toast) return null;
        return {
            toast,
            mensagem: toast.querySelector("[data-toast-message]"),
            acao: toast.querySelector("[data-toast-action]"),
            fechar: toast.querySelector("[data-toast-close]")
        };
    }

    function mostrarToast(mensagem, tipo, acao) {
        const els = elementosToast();
        if (!els || !els.mensagem) return;
        clearTimeout(toastTimer);
        els.toast.className = `toast toast-${tipo}`;
        els.mensagem.textContent = mensagem;
        if (els.acao) {
            els.acao.hidden = !acao;
            els.acao.onclick = acao || null;
        }
        els.toast.hidden = false;
        toastTimer = setTimeout(() => { els.toast.hidden = true; }, 7000);
    }

    function inicializarToast() {
        if (toastFecharRegistrado) return; // não registra o mesmo listener duas vezes
        const els = elementosToast();
        if (!els || !els.fechar) return;
        els.fechar.addEventListener("click", () => {
            clearTimeout(toastTimer);
            els.toast.hidden = true;
        });
        toastFecharRegistrado = true;
    }

    async function copiarChavePix(botao) {
        const chave = botao.dataset.copiarPix;
        let copiou = false;
        try {
            if (!navigator.clipboard || !navigator.clipboard.writeText) {
                throw new Error("Clipboard indisponível");
            }
            await navigator.clipboard.writeText(chave);
            copiou = true;
        } catch (erro) {
            const auxiliar = document.createElement("textarea");
            auxiliar.value = chave;
            auxiliar.setAttribute("readonly", "");
            auxiliar.style.position = "fixed";
            auxiliar.style.opacity = "0";
            document.body.appendChild(auxiliar);
            auxiliar.select();
            try { copiou = document.execCommand("copy"); } catch (erroFallback) { copiou = false; }
            auxiliar.remove();
        }

        if (copiou) {
            mostrarToast("Chave Pix copiada com sucesso.", "sucesso");
            /* Desabilita por um instante: evidencia o estado :disabled
               nativo e evita cópias repetidas em sequência. */
            botao.disabled = true;
            botao.setAttribute("aria-label", "Chave Pix copiada");
            setTimeout(() => {
                botao.disabled = false;
                botao.removeAttribute("aria-label");
            }, 1500);
        } else {
            mostrarToast("Não foi possível copiar automaticamente. Selecione a chave Pix e copie manualmente.", "atencao", () => {
                const chaveEl = document.querySelector(".chave-pix");
                if (!chaveEl) return;
                const selecao = window.getSelection();
                const intervalo = document.createRange();
                intervalo.selectNodeContents(chaveEl);
                selecao.removeAllRanges();
                selecao.addRange(intervalo);
            });
        }
    }

    function inicializarCopiaPix() {
        if (pixDelegacaoRegistrada) return;
        document.addEventListener("click", (event) => {
            const botao = event.target.closest("[data-copiar-pix]");
            if (!botao || botao.disabled) return;
            copiarChavePix(botao);
        });
        pixDelegacaoRegistrada = true;
    }

    /* =====================================================
       FAVORITOS DE PROJETOS
       Guarda só os identificadores dos projetos favoritados;
       templates.js usa esses ids para buscar título, imagem e
       descrição no array original PROJETOS na hora de renderizar.
       ===================================================== */

    function listarFavoritos() {
        return armazenamento ? armazenamento.lerPreferencia(CHAVE_FAVORITOS, []) : [];
    }

    function estaFavorito(id) {
        return listarFavoritos().includes(id);
    }

    /* Alterna o id na lista e tenta persistir. Devolve o novo estado
       e se a gravação realmente aconteceu, para quem chamou decidir
       se confirma a ação ao usuário ou não (nunca confirmar uma
       gravação que falhou). */
    function alternarFavorito(id) {
        const atuais = listarFavoritos();
        const indice = atuais.indexOf(id);
        let favoritado;
        if (indice === -1) { atuais.push(id); favoritado = true; }
        else { atuais.splice(indice, 1); favoritado = false; }

        let sucesso = true;
        if (armazenamento) {
            sucesso = atuais.length
                ? armazenamento.salvarPreferencia(CHAVE_FAVORITOS, atuais)
                : armazenamento.removerPreferencia(CHAVE_FAVORITOS);
        }
        return { favoritado, sucesso };
    }

    function limparFavoritos() {
        return armazenamento ? armazenamento.removerPreferencia(CHAVE_FAVORITOS) : true;
    }

    function botaoFavoritoHTML(id, titulo) {
        const favorito = estaFavorito(id);
        const texto = favorito ? "Remover dos favoritos" : "Salvar projeto";
        const tituloAtributo = (titulo || "").replace(/"/g, "&quot;");
        return `<button type="button" class="botao-favorito" data-favorito="${id}" data-favorito-titulo="${tituloAtributo}" aria-pressed="${favorito}">${texto}</button>`;
    }

    /* Reaplica o filtro "somente favoritos" ao conjunto de cartões
       atualmente renderizado (se houver): mostra/esconde cada
       cartão pelo data-projeto-id e alterna a mensagem de "nenhum
       favorito". Chamada tanto ao alternar o filtro quanto ao
       favoritar/desfavoritar um projeto com o filtro já ativo. */
    function aplicarFiltroFavoritos() {
        const grade = document.querySelector("[data-grade-projetos]");
        const toggle = document.querySelector("[data-filtro-favoritos]");
        if (!grade || !toggle) return;

        const ativo = toggle.getAttribute("aria-pressed") === "true";
        const favoritos = listarFavoritos();
        const cartoes = [...grade.querySelectorAll("[data-projeto-id]")];
        let algumVisivel = false;

        cartoes.forEach((cartao) => {
            const visivel = !ativo || favoritos.includes(cartao.dataset.projetoId);
            cartao.hidden = !visivel;
            if (visivel) algumVisivel = true;
        });

        const mensagemVazia = document.querySelector("[data-favoritos-vazio]");
        const semResultado = ativo && !algumVisivel;
        if (mensagemVazia) mensagemVazia.hidden = !semResultado;
        grade.hidden = semResultado;
    }

    /* Mostra/esconde o botão "Limpar favoritos" (só existe na página
       Projetos) conforme ainda houver algum id salvo. */
    function atualizarBotaoLimparFavoritos() {
        const botao = document.querySelector("[data-limpar-favoritos]");
        if (botao) botao.hidden = listarFavoritos().length === 0;
    }

    function aoClicarFavorito(botao) {
        const id = botao.dataset.favorito;
        const titulo = botao.dataset.favoritoTitulo || "Projeto";
        const resultado = alternarFavorito(id);

        if (!resultado.sucesso) {
            /* Nunca confirma uma gravação que não aconteceu: o botão
               mantém o texto e o aria-pressed que já tinha. */
            mostrarToast("Não foi possível salvar sua preferência neste navegador.", "atencao");
            return;
        }

        botao.textContent = resultado.favoritado ? "Remover dos favoritos" : "Salvar projeto";
        botao.setAttribute("aria-pressed", String(resultado.favoritado));
        mostrarToast(
            resultado.favoritado ? `"${titulo}" foi adicionado aos favoritos.` : `"${titulo}" foi removido dos favoritos.`,
            "sucesso"
        );
        aplicarFiltroFavoritos();
        atualizarBotaoLimparFavoritos();
    }

    function aoClicarFiltroFavoritos(toggle) {
        const ativo = toggle.getAttribute("aria-pressed") !== "true";
        toggle.setAttribute("aria-pressed", String(ativo));
        toggle.textContent = ativo ? "Mostrar todos os projetos" : "Mostrar somente favoritos";
        aplicarFiltroFavoritos();
    }

    function aoClicarLimparFavoritos(botao) {
        if (!listarFavoritos().length) return;
        const sucesso = limparFavoritos();
        if (!sucesso) {
            mostrarToast("Não foi possível limpar os favoritos neste navegador.", "atencao");
            return;
        }

        document.querySelectorAll("[data-favorito]").forEach((botaoFavorito) => {
            botaoFavorito.textContent = "Salvar projeto";
            botaoFavorito.setAttribute("aria-pressed", "false");
        });
        aplicarFiltroFavoritos();
        atualizarBotaoLimparFavoritos();
        mostrarToast("Seus favoritos foram removidos.", "sucesso");
    }

    function inicializarFavoritos() {
        if (favoritosDelegacaoRegistrada) return;
        document.addEventListener("click", (event) => {
            const botaoFavorito = event.target.closest("[data-favorito]");
            if (botaoFavorito) { aoClicarFavorito(botaoFavorito); return; }
            const toggle = event.target.closest("[data-filtro-favoritos]");
            if (toggle) { aoClicarFiltroFavoritos(toggle); return; }
            const limpar = event.target.closest("[data-limpar-favoritos]");
            if (limpar) aoClicarLimparFavoritos(limpar);
        });
        favoritosDelegacaoRegistrada = true;
    }

    return {
        badgeHTML,
        alertaHTML,
        mostrarToast,
        inicializarToast,
        inicializarCopiaPix,
        listarFavoritos,
        estaFavorito,
        botaoFavoritoHTML,
        inicializarFavoritos
    };
})();
