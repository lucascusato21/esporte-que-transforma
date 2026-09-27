/* =========================================================
   CARROSSEL — controles do carrossel da página inicial
   Como a página inicial pode ser renderizada várias vezes (o
   usuário pode sair e voltar para "início" dentro do SPA), iniciar()
   pode ser chamado mais de uma vez: ele sempre limpa o intervalo
   anterior antes de criar um novo, para nunca haver dois intervalos
   rodando ao mesmo tempo nem um intervalo "fantasma" depois que o
   carrossel saiu da tela.
   ========================================================= */
window.ONG = window.ONG || {};

window.ONG.carrossel = (function () {
    "use strict";

    let intervalo;

    function parar() {
        clearInterval(intervalo);
    }

    function iniciar() {
        parar();

        const carrossel = document.querySelector("[data-carrossel]");
        if (!carrossel) return;

        const slides = [...carrossel.querySelectorAll("[data-slide]")];
        const indicadores = [...carrossel.querySelectorAll("[data-slide-control]")];
        const anterior = carrossel.querySelector("[data-anterior]");
        const proxima = carrossel.querySelector("[data-proxima]");
        const pausa = carrossel.querySelector("[data-pausar-carrossel]");
        const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
        let atual = 0;
        let pausado = false;

        function mostrarSlide(indice) {
            atual = (indice + slides.length) % slides.length;
            slides.forEach((slide, index) => {
                const ativo = index === atual;
                slide.classList.toggle("ativo", ativo);
                slide.setAttribute("aria-hidden", String(!ativo));
            });
            indicadores.forEach((indicador, index) => {
                const ativo = index === atual;
                indicador.classList.toggle("ativo", ativo);
                indicador.setAttribute("aria-pressed", String(ativo));
            });
        }

        function atualizarPausa() {
            if (!pausa) return;
            pausa.textContent = "Pausar apresentação";
            pausa.setAttribute("aria-pressed", String(pausado || reduzirMovimento.matches));
            pausa.disabled = reduzirMovimento.matches;
        }

        function iniciarRotacao() {
            if (reduzirMovimento.matches || pausado) return;
            clearInterval(intervalo);
            intervalo = setInterval(() => mostrarSlide(atual + 1), 6000);
        }

        function pausarTemporariamente() {
            clearInterval(intervalo);
        }

        if (anterior) anterior.addEventListener("click", () => { mostrarSlide(atual - 1); iniciarRotacao(); });
        if (proxima) proxima.addEventListener("click", () => { mostrarSlide(atual + 1); iniciarRotacao(); });
        if (pausa) pausa.addEventListener("click", () => {
            if (reduzirMovimento.matches) return;
            pausado = !pausado;
            if (pausado) pausarTemporariamente();
            else iniciarRotacao();
            atualizarPausa();
        });
        indicadores.forEach((indicador, index) => indicador.addEventListener("click", () => { mostrarSlide(index); iniciarRotacao(); }));
        carrossel.addEventListener("mouseenter", pausarTemporariamente);
        carrossel.addEventListener("mouseleave", iniciarRotacao);
        carrossel.addEventListener("focusin", pausarTemporariamente);
        carrossel.addEventListener("focusout", (event) => {
            if (!carrossel.contains(event.relatedTarget)) iniciarRotacao();
        });
        reduzirMovimento.addEventListener("change", () => {
            if (reduzirMovimento.matches) pausarTemporariamente();
            else iniciarRotacao();
            atualizarPausa();
        });

        mostrarSlide(0);
        atualizarPausa();
        iniciarRotacao();
    }

    return { iniciar, parar };
})();
