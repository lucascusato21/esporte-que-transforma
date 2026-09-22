/* =========================================================
   FORMULÁRIOS — validação, máscaras e mensagens
   Os formulários de cadastro são recriados a cada renderização de
   rota (são conteúdo de #app), então em vez de religar listeners
   em cada campo depois de cada renderização, usamos delegação de
   eventos a partir de #app: os listeners são registrados uma única
   vez em inicializar() e continuam funcionando não importa qual
   formulário exista dentro de #app no momento.
   ========================================================= */
window.ONG = window.ONG || {};

window.ONG.formularios = (function () {
    "use strict";

    const armazenamento = window.ONG.armazenamento;
    const CHAVE_RASCUNHO = "rascunho-mensagem-voluntario";

    function apenasNumeros(valor, limite) {
        return valor.replace(/\D/g, "").slice(0, limite);
    }

    function formatarCpf(valor) {
        return apenasNumeros(valor, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    function formatarTelefone(valor) {
        return apenasNumeros(valor, 11)
            .replace(/^(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }

    function formatarCep(valor) {
        return apenasNumeros(valor, 8).replace(/(\d{5})(\d{1,3})$/, "$1-$2");
    }

    function aplicarMascara(campo) {
        if (campo.id === "cpf") campo.value = formatarCpf(campo.value);
        else if (campo.id === "telefone" || campo.id === "responsavel-telefone") campo.value = formatarTelefone(campo.value);
        else if (campo.id === "cep") campo.value = formatarCep(campo.value);
    }

    function mensagemPara(campo) {
        if (campo.validity.valueMissing) return "Este campo é obrigatório.";
        if (campo.validity.typeMismatch) return "Informe um formato válido.";
        if (campo.validity.patternMismatch) return "Confira o formato informado.";
        if (campo.validity.tooShort) return `Digite pelo menos ${campo.minLength} caracteres.`;
        return "Confira este campo.";
    }

    function limparErro(campo) {
        const grupo = campo.closest(".campo, .opcao");
        const mensagem = grupo ? grupo.querySelector(".mensagem-campo") : null;
        if (mensagem) mensagem.remove();
        if (grupo) grupo.classList.remove("mostrar-erro");
        campo.removeAttribute("aria-invalid");
        const original = campo.dataset.originalDescribedby;
        if (original) campo.setAttribute("aria-describedby", original);
        else campo.removeAttribute("aria-describedby");
    }

    function validarCampo(campo, mostrar) {
        if (campo.validity.valid) { limparErro(campo); return true; }
        if (!mostrar) return false;
        const grupo = campo.closest(".campo, .opcao") || campo.parentElement;
        grupo.classList.add("mostrar-erro");
        campo.setAttribute("aria-invalid", "true");
        if (!campo.dataset.originalDescribedby && campo.getAttribute("aria-describedby")) {
            campo.dataset.originalDescribedby = campo.getAttribute("aria-describedby");
        }
        let mensagem = grupo.querySelector(".mensagem-campo");
        if (!mensagem) {
            mensagem = document.createElement("span");
            mensagem.className = "mensagem-campo";
            mensagem.id = `${campo.id}-erro`;
            grupo.appendChild(mensagem);
        }
        mensagem.textContent = mensagemPara(campo);
        campo.setAttribute("aria-describedby", mensagem.id);
        return false;
    }

    function camposDoFormulario(form) {
        return [...form.querySelectorAll("input, select, textarea")];
    }

    function salvarRascunhoMensagem(valor) {
        if (!armazenamento) return;
        if (!valor) armazenamento.removerPreferencia(CHAVE_RASCUNHO);
        else armazenamento.salvarPreferencia(CHAVE_RASCUNHO, valor);
    }

    function limparRascunhoMensagem() {
        if (armazenamento) armazenamento.removerPreferencia(CHAVE_RASCUNHO);
    }

    function lerRascunhoMensagem() {
        return armazenamento ? armazenamento.lerPreferencia(CHAVE_RASCUNHO, "") : "";
    }

    let delegacaoRegistrada = false;

    function inicializar(raizSeletor) {
        if (delegacaoRegistrada) return; // evita registrar os mesmos listeners de novo
        const raiz = document.querySelector(raizSeletor);
        if (!raiz) return;

        raiz.addEventListener("input", (event) => {
            const campo = event.target;
            if (!campo.matches || !campo.matches("input, select, textarea")) return;
            aplicarMascara(campo);
            if (campo.matches("[aria-invalid='true']")) validarCampo(campo, true);
            if (campo.id === "mensagem") salvarRascunhoMensagem(campo.value);
        });

        /* blur/focus não borbulham: escutamos na fase de captura. */
        raiz.addEventListener("blur", (event) => {
            const campo = event.target;
            if (!campo.matches || !campo.matches("input, select, textarea")) return;
            validarCampo(campo, true);
        }, true);

        raiz.addEventListener("change", (event) => {
            const campo = event.target;
            if (!campo.matches || !campo.matches("input, select, textarea")) return;
            if (campo.matches("[aria-invalid='true']")) validarCampo(campo, true);
        });

        raiz.addEventListener("submit", (event) => {
            const form = event.target.closest ? event.target.closest("form") : null;
            if (!form) return;
            event.preventDefault();
            const campos = camposDoFormulario(form);
            const validos = campos.map((campo) => validarCampo(campo, true));
            const formStatus = form.querySelector("[data-form-status]");
            const primeiroErro = campos[validos.indexOf(false)];
            if (primeiroErro) {
                primeiroErro.focus();
                if (formStatus) {
                    formStatus.className = "status-formulario alerta alerta-erro";
                    formStatus.hidden = false;
                    formStatus.textContent = "Revise os campos destacados antes de continuar.";
                }
                return;
            }
            if (formStatus) {
                formStatus.className = "status-formulario alerta alerta-sucesso";
                formStatus.hidden = false;
                formStatus.textContent = "Validação concluída. Este cadastro é demonstrativo e não envia nem armazena dados.";
            }
            limparRascunhoMensagem();
        });

        raiz.addEventListener("reset", (event) => {
            const form = event.target.closest ? event.target.closest("form") : null;
            if (!form) return;
            setTimeout(() => {
                camposDoFormulario(form).forEach(limparErro);
                const formStatus = form.querySelector("[data-form-status]");
                if (formStatus) { formStatus.hidden = true; formStatus.textContent = ""; }
                limparRascunhoMensagem();
            }, 0);
        });

        delegacaoRegistrada = true;
    }

    return { inicializar, lerRascunhoMensagem };
})();
