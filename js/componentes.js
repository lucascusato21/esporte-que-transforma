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
    let toastOrigem = null;
    let toastFecharRegistrado = false;
    let pixDelegacaoRegistrada = false;
    let favoritosDelegacaoRegistrada = false;
    let idsProjetos = new Set();
    let favoritosMemoria = [];

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

    function ocultarToast() {
        const els = elementosToast();
        if (!els) return;
        clearTimeout(toastTimer);
        const devolverFoco = els.toast.contains(document.activeElement);
        const origem = toastOrigem;
        els.toast.hidden = true;
        toastOrigem = null;
        if (devolverFoco && origem && origem !== document.body && origem.isConnected && !origem.disabled && !origem.closest("[hidden]") && origem.getClientRects().length) {
            origem.focus();
        }
    }

    function mostrarToast(mensagem, tipo, acao) {
        const els = elementosToast();
        if (!els || !els.mensagem) return;
        clearTimeout(toastTimer);
        toastOrigem = document.activeElement === document.body ? null : document.activeElement;
        els.toast.className = `toast toast-${tipo}`;
        els.mensagem.textContent = mensagem;
        if (els.acao) {
            els.acao.hidden = !acao;
            els.acao.onclick = acao || null;
        }
        els.toast.hidden = false;
        toastTimer = setTimeout(ocultarToast, 7000);
    }

    function inicializarToast() {
        if (toastFecharRegistrado) return; // não registra o mesmo listener duas vezes
        const els = elementosToast();
        if (!els || !els.fechar) return;
        els.fechar.addEventListener("click", ocultarToast);
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
            const chaveEl = document.querySelector(".chave-pix");
            if (chaveEl) {
                const intervalo = document.createRange();
                intervalo.selectNodeContents(chaveEl);
                const selecao = window.getSelection();
                selecao.removeAllRanges();
                selecao.addRange(intervalo);
                try { copiou = document.execCommand("copy"); } catch (erroFallback) { copiou = false; }
                selecao.removeAllRanges();
            }
        }

        if (copiou) {
            mostrarToast("Chave Pix copiada com sucesso.", "sucesso");
            botao.setAttribute("aria-disabled", "true");
            botao.setAttribute("aria-label", "Chave Pix copiada");
            setTimeout(() => {
                botao.removeAttribute("aria-disabled");
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
            if (!botao || botao.disabled || botao.getAttribute("aria-disabled") === "true") return;
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

    function normalizarFavoritos(valor) {
        if (!Array.isArray(valor)) return [];
        return [...new Set(valor.filter((id) => typeof id === "string" && idsProjetos.has(id)))];
    }

    function configurarFavoritos(ids) {
        idsProjetos = new Set(Array.isArray(ids) ? ids : []);
        const recuperados = armazenamento
            ? armazenamento.lerPreferencia(CHAVE_FAVORITOS, [])
            : [];
        favoritosMemoria = normalizarFavoritos(recuperados);
    }

    function listarFavoritos() {
        return favoritosMemoria.slice();
    }

    function estaFavorito(id) {
        return listarFavoritos().includes(id);
    }

    /* Alterna o id na lista e tenta persistir. Devolve o novo estado
       e se a gravação realmente aconteceu, para quem chamou decidir
       se confirma a ação ao usuário ou não (nunca confirmar uma
       gravação que falhou). */
    function alternarFavorito(id) {
        if (!idsProjetos.has(id)) return { valido: false, favoritado: null, persistido: null };

        const atuais = listarFavoritos();
        const indice = atuais.indexOf(id);
        let favoritado;
        if (indice === -1) { atuais.push(id); favoritado = true; }
        else { atuais.splice(indice, 1); favoritado = false; }
        favoritosMemoria = atuais;

        let persistido = false;
        if (armazenamento) {
            persistido = atuais.length
                ? armazenamento.salvarPreferencia(CHAVE_FAVORITOS, atuais)
                : armazenamento.removerPreferencia(CHAVE_FAVORITOS);
        }
        return { valido: true, favoritado, persistido };
    }

    function limparFavoritos() {
        favoritosMemoria = [];
        return {
            persistido: armazenamento ? armazenamento.removerPreferencia(CHAVE_FAVORITOS) : false
        };
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

    function atualizarBotoesFavoritos() {
        const favoritos = listarFavoritos();
        document.querySelectorAll("[data-favorito]").forEach((botao) => {
            const favorito = favoritos.includes(botao.dataset.favorito);
            botao.textContent = favorito ? "Remover dos favoritos" : "Salvar projeto";
            botao.setAttribute("aria-pressed", String(favorito));
        });
    }

    function atualizarInterfaceFavoritos() {
        atualizarBotoesFavoritos();
        aplicarFiltroFavoritos();
        atualizarBotaoLimparFavoritos();
    }

    function aoClicarFavorito(botao) {
        const id = botao.dataset.favorito;
        const titulo = botao.dataset.favoritoTitulo || "Projeto";
        const resultado = alternarFavorito(id);

        if (!resultado.valido) {
            mostrarToast("Não foi possível alterar este favorito: projeto inválido.", "atencao");
            return;
        }

        atualizarInterfaceFavoritos();
        if (botao.closest("[hidden]")) {
            const filtro = document.querySelector("[data-filtro-favoritos]");
            if (filtro) filtro.focus();
        }
        const acao = resultado.favoritado ? "adicionado aos favoritos" : "removido dos favoritos";
        const mensagem = resultado.persistido
            ? `"${titulo}" foi ${acao}.`
            : `"${titulo}" foi ${acao} somente nesta visita. A alteração não será mantida para a próxima visita.`;
        mostrarToast(mensagem, resultado.persistido ? "sucesso" : "atencao");
    }

    function aoClicarFiltroFavoritos(toggle) {
        const ativo = toggle.getAttribute("aria-pressed") !== "true";
        toggle.setAttribute("aria-pressed", String(ativo));
        toggle.textContent = ativo ? "Mostrar todos os projetos" : "Mostrar somente favoritos";
        atualizarInterfaceFavoritos();
    }

    function aoClicarLimparFavoritos(botao) {
        if (!listarFavoritos().length) return;
        const focoEstavaNoBotao = document.activeElement === botao;
        const resultado = limparFavoritos();
        atualizarInterfaceFavoritos();
        if (focoEstavaNoBotao) {
            const filtro = document.querySelector("[data-filtro-favoritos]");
            if (filtro) filtro.focus();
        }
        mostrarToast(
            resultado.persistido
                ? "Seus favoritos foram removidos."
                : "Seus favoritos foram removidos somente nesta visita. A alteração não será mantida para a próxima visita.",
            resultado.persistido ? "sucesso" : "atencao"
        );
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
        configurarFavoritos,
        listarFavoritos,
        estaFavorito,
        botaoFavoritoHTML,
        inicializarFavoritos
    };
})();
