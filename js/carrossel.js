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
        const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
        let atual = 0;

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
                indicador.setAttribute("aria-selected", String(ativo));
            });
        }

        function iniciarRotacao() {
            if (reduzirMovimento.matches) return;
            clearInterval(intervalo);
            intervalo = setInterval(() => mostrarSlide(atual + 1), 6000);
        }

        if (anterior) anterior.addEventListener("click", () => { mostrarSlide(atual - 1); iniciarRotacao(); });
        if (proxima) proxima.addEventListener("click", () => { mostrarSlide(atual + 1); iniciarRotacao(); });
        indicadores.forEach((indicador, index) => indicador.addEventListener("click", () => { mostrarSlide(index); iniciarRotacao(); }));
        carrossel.addEventListener("mouseenter", () => clearInterval(intervalo));
        carrossel.addEventListener("mouseleave", iniciarRotacao);
        carrossel.addEventListener("focusin", () => clearInterval(intervalo));
        carrossel.addEventListener("focusout", iniciarRotacao);
        reduzirMovimento.addEventListener("change", iniciarRotacao);

        mostrarSlide(0);
        iniciarRotacao();
    }

    return { iniciar, parar };
})();
