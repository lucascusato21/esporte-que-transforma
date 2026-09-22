(() => {
    const toast = document.querySelector("[data-toast]");
    const toastMessage = toast?.querySelector("[data-toast-message]");
    const toastAction = toast?.querySelector("[data-toast-action]");
    const toastClose = toast?.querySelector("[data-toast-close]");
    let toastTimer;

    function mostrarToast(mensagem, tipo, acao) {
        if (!toast || !toastMessage) return;
        clearTimeout(toastTimer);
        toast.className = `toast toast-${tipo}`;
        toastMessage.textContent = mensagem;
        if (toastAction) {
            toastAction.hidden = !acao;
            toastAction.onclick = acao || null;
        }
        toast.hidden = false;
        toastTimer = setTimeout(() => { toast.hidden = true; }, 7000);
    }

    toastClose?.addEventListener("click", () => {
        clearTimeout(toastTimer);
        toast.hidden = true;
    });

    const pixButton = document.querySelector("[data-copiar-pix]");
    const chavePix = document.querySelector(".chave-pix");
    async function copiarPix() {
        const chave = pixButton.dataset.copiarPix;
        let copiou = false;
        try {
            if (!navigator.clipboard?.writeText) throw new Error("Clipboard indisponível");
            await navigator.clipboard.writeText(chave);
            copiou = true;
        } catch (error) {
            const auxiliar = document.createElement("textarea");
            auxiliar.value = chave;
            auxiliar.setAttribute("readonly", "");
            auxiliar.style.position = "fixed";
            auxiliar.style.opacity = "0";
            document.body.appendChild(auxiliar);
            auxiliar.select();
            try { copiou = document.execCommand("copy"); } catch (fallbackError) { copiou = false; }
            auxiliar.remove();
        }
        if (copiou) {
            mostrarToast("Chave Pix copiada com sucesso.", "sucesso");
            /* Desabilita o botão por um instante: evidencia o estado
               :disabled nativo e evita cópias repetidas em sequência. */
            pixButton.disabled = true;
            pixButton.setAttribute("aria-label", "Chave Pix copiada");
            setTimeout(() => {
                pixButton.disabled = false;
                pixButton.removeAttribute("aria-label");
            }, 1500);
        } else {
            mostrarToast("Não foi possível copiar automaticamente. Selecione a chave Pix e copie manualmente.", "atencao", () => {
                if (!chavePix) return;
                const selecao = window.getSelection();
                const intervalo = document.createRange();
                intervalo.selectNodeContents(chavePix);
                selecao.removeAllRanges();
                selecao.addRange(intervalo);
            });
        }
    }
    pixButton?.addEventListener("click", copiarPix);

    const forms = document.querySelectorAll("form");
    function apenasNumeros(valor, limite) { return valor.replace(/\D/g, "").slice(0, limite); }
    function formatarCpf(valor) { return apenasNumeros(valor, 11).replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2"); }
    function formatarTelefone(valor) { return apenasNumeros(valor, 11).replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2"); }
    function formatarCep(valor) { return apenasNumeros(valor, 8).replace(/(\d{5})(\d{1,3})$/, "$1-$2"); }

    function mensagemPara(campo) {
        if (campo.validity.valueMissing) return "Este campo é obrigatório.";
        if (campo.validity.typeMismatch) return "Informe um formato válido.";
        if (campo.validity.patternMismatch) return "Confira o formato informado.";
        if (campo.validity.tooShort) return `Digite pelo menos ${campo.minLength} caracteres.`;
        return "Confira este campo.";
    }

    function limparErro(campo) {
        const grupo = campo.closest(".campo, .opcao");
        const mensagem = grupo?.querySelector(".mensagem-campo");
        mensagem?.remove();
        grupo?.classList.remove("mostrar-erro");
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

    forms.forEach((form) => {
        const campos = {
            cpf: form.querySelector("#cpf"),
            telefone: form.querySelector("#telefone, #responsavel-telefone"),
            cep: form.querySelector("#cep")
        };
        if (campos.cpf) campos.cpf.addEventListener("input", () => { campos.cpf.value = formatarCpf(campos.cpf.value); });
        if (campos.telefone) campos.telefone.addEventListener("input", () => { campos.telefone.value = formatarTelefone(campos.telefone.value); });
        if (campos.cep) campos.cep.addEventListener("input", () => { campos.cep.value = formatarCep(campos.cep.value); });

        const formStatus = form.querySelector("[data-form-status]");
        const camposValidaveis = [...form.querySelectorAll("input, select, textarea")];
        camposValidaveis.forEach((campo) => {
            campo.addEventListener("blur", () => validarCampo(campo, true));
            campo.addEventListener("input", () => { if (campo.matches("[aria-invalid='true']")) validarCampo(campo, true); });
            campo.addEventListener("change", () => { if (campo.matches("[aria-invalid='true']")) validarCampo(campo, true); });
        });
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const validos = camposValidaveis.map((campo) => validarCampo(campo, true));
            const primeiroErro = camposValidaveis[validos.indexOf(false)];
            if (primeiroErro) {
                primeiroErro.focus();
                if (formStatus) { formStatus.className = "status-formulario alerta alerta-erro"; formStatus.hidden = false; formStatus.textContent = "Revise os campos destacados antes de continuar."; }
                return;
            }
            if (formStatus) { formStatus.className = "status-formulario alerta alerta-sucesso"; formStatus.hidden = false; formStatus.textContent = "Validação concluída. Este cadastro é demonstrativo e não envia nem armazena dados."; }
        });
        form.addEventListener("reset", () => {
            setTimeout(() => {
                camposValidaveis.forEach(limparErro);
                if (formStatus) { formStatus.hidden = true; formStatus.textContent = ""; }
            }, 0);
        });
    });
})();
