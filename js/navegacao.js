/* =========================================================
   NAVEGAÇÃO — rotas do SPA, histórico, foco, menu e dropdown
   Intercepta cliques em links com [data-rota], troca o conteúdo de
   #app, usa history.pushState()/popstate para Voltar e Avançar sem
   recarregar a página, e move o foco para o título da rota nova.
   Também controla o menu hambúrguer e o dropdown de "Projetos" no
   cabeçalho fixo (esta parte substitui o antigo js/menu.js: como o
   cabeçalho não é recriado a cada rota, os listeners aqui são
   registrados uma única vez, na inicialização).
   ========================================================= */
window.ONG = window.ONG || {};

window.ONG.navegacao = (function () {
    "use strict";

    const armazenamento = window.ONG.armazenamento;

    let registroRotas = {};
    let rotaPadrao = "inicio";

    function normalizarRota(hashOuRota) {
        const limpo = String(hashOuRota || "").replace(/^#/, "").trim();
        return limpo === "" ? rotaPadrao : limpo;
    }

    function atualizarLinkAtivo(rota) {
        document.querySelectorAll("[data-rota]").forEach((link) => {
            if (link.dataset.rota === rota) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
    }

    function moverFoco(app) {
        const titulo = app.querySelector("h1");
        if (titulo) {
            titulo.setAttribute("tabindex", "-1");
            titulo.focus();
        } else {
            app.focus();
        }
    }

    function renderizar(rotaBruta, opcoes) {
        opcoes = opcoes || {};
        const app = document.getElementById("app");
        if (!app) return;

        const rota = normalizarRota(rotaBruta);

        /* Âncora interna de uma página já renderizada (ex.: "#materiais"
           dentro da rota "doacao"): não é uma rota da SPA, só rola até
           o elemento, sem trocar #app nem mexer no histórico. */
        if (!registroRotas[rota]) {
            const alvo = document.getElementById(rota);
            if (alvo && app.contains(alvo)) {
                const comportamento = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
                alvo.scrollIntoView({ behavior: comportamento, block: "start" });
                return;
            }
        }

        if (window.ONG.carrossel) window.ONG.carrossel.parar();

        const config = registroRotas[rota];
        let html;
        let titulo;

        if (config) {
            html = window.ONG.templates ? config.render() : null;
            titulo = config.titulo;
        }

        if (!config || html === null || html === undefined) {
            html = window.ONG.templates ? window.ONG.templates.paginaErro(rotaBruta) : "";
            titulo = "Página não encontrada";
            document.body.className = "";
            app.className = "container";
        } else {
            document.body.className = config.bodyClasse || "";
            app.className = config.appClasse || "";
        }

        app.innerHTML = html;
        document.title = titulo ? `${titulo} | Esporte que Transforma` : "Esporte que Transforma";

        if (config && rota === "inicio" && window.ONG.carrossel) {
            window.ONG.carrossel.iniciar();
        }

        atualizarLinkAtivo(config ? rota : "");

        if (armazenamento) armazenamento.salvarPreferencia("ultima-rota", rota);

        if (!opcoes.semRolagem) window.scrollTo(0, 0);
        if (!opcoes.semFoco) moverFoco(app);
    }

    function irPara(rota, opcoes) {
        opcoes = opcoes || {};
        const rotaNormalizada = normalizarRota(rota);
        if (opcoes.substituir) history.replaceState({ rota: rotaNormalizada }, "", `#${rotaNormalizada}`);
        else history.pushState({ rota: rotaNormalizada }, "", `#${rotaNormalizada}`);
        renderizar(rotaNormalizada, opcoes);
    }

    function fecharMenusAbertos() {
        if (refsMenu.menu) { definirSubmenu(false); definirMenu(false); }
    }

    function aoClicarLink(event) {
        const link = event.target.closest("[data-rota]");
        if (!link) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const rota = link.dataset.rota;
        if (rota !== normalizarRota(location.hash)) irPara(rota);
        fecharMenusAbertos();
    }

    /* ---- Menu hambúrguer e dropdown de "Projetos" ---- */
    let refsMenu = {};
    let menuInicializado = false;

    function definirSubmenu(aberto) {
        const { submenu, subToggle } = refsMenu;
        if (!submenu || !subToggle) return;
        submenu.hidden = !aberto;
        subToggle.setAttribute("aria-expanded", String(aberto));
        subToggle.setAttribute("aria-label", aberto ? "Fechar projetos" : "Abrir projetos");
    }

    function definirMenu(aberto) {
        const { menu, toggle } = refsMenu;
        if (!menu || !toggle) return;
        menu.classList.toggle("aberto", aberto);
        toggle.setAttribute("aria-expanded", String(aberto));
        if (!aberto) definirSubmenu(false);
    }

    function inicializarMenu() {
        if (menuInicializado) return;
        const nav = document.querySelector(".navegacao");
        if (!nav) return;
        const toggle = nav.querySelector(".menu-toggle");
        const menu = nav.querySelector(".menu");
        const subToggle = nav.querySelector(".submenu-toggle");
        const submenu = nav.querySelector(".submenu");
        const item = nav.querySelector(".item-submenu");
        /* Mesmo limite de 768px usado em css/navegacao.css
           ("@media (min-width: 768px)"), usado de forma invertida
           para nunca haver largura em que CSS e JS discordem. */
        const desktop = window.matchMedia("(min-width: 768px)");
        if (!toggle || !menu) return;

        refsMenu = { nav, toggle, menu, subToggle, submenu, item };

        toggle.hidden = false;
        if (subToggle) subToggle.hidden = false;
        definirSubmenu(false);
        nav.classList.add("navegacao-pronta");

        toggle.addEventListener("click", () => definirMenu(toggle.getAttribute("aria-expanded") !== "true"));
        if (subToggle) {
            subToggle.addEventListener("click", () => definirSubmenu(subToggle.getAttribute("aria-expanded") !== "true"));
        }
        nav.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            if (submenu && !submenu.hidden) {
                event.preventDefault();
                definirSubmenu(false);
                subToggle.focus();
            } else if (!desktop.matches && menu.classList.contains("aberto")) {
                event.preventDefault();
                definirMenu(false);
                toggle.focus();
            }
        });
        document.addEventListener("click", (event) => {
            if (item && !item.contains(event.target)) {
                if (submenu && submenu.contains(document.activeElement)) subToggle.focus();
                definirSubmenu(false);
            }
            if (!nav.contains(event.target) && !desktop.matches) {
                if (menu.contains(document.activeElement)) toggle.focus();
                definirMenu(false);
            }
        });
        document.addEventListener("focusin", (event) => {
            if (item && !item.contains(event.target)) definirSubmenu(false);
            if (!nav.contains(event.target) && !desktop.matches) definirMenu(false);
        });
        desktop.addEventListener("change", () => {
            if (!desktop.matches && menu.contains(document.activeElement)) toggle.focus();
            if (desktop.matches && document.activeElement === toggle) {
                const primeiroLink = menu.querySelector("a");
                if (primeiroLink) primeiroLink.focus();
            }
            if (submenu && submenu.contains(document.activeElement)) subToggle.focus();
            definirMenu(false);
        });

        menuInicializado = true;
    }

    /* ---- Inicialização ---- */
    let roteadorInicializado = false;

    function inicializar(registro, opcoes) {
        registroRotas = registro || {};
        rotaPadrao = (opcoes && opcoes.rotaPadrao) || "inicio";

        inicializarMenu();

        if (!roteadorInicializado) {
            document.addEventListener("click", aoClicarLink);
            window.addEventListener("popstate", () => renderizar(location.hash));
            roteadorInicializado = true;
        }

        let rotaInicial = normalizarRota(location.hash);

        /* Sem hash na URL (ex.: abrir index.html direto, com duplo
           clique): retoma a última rota visitada neste navegador, se
           ela ainda existir no registro de rotas. Se já houver um
           hash (link direto, atualização de página ou Voltar/Avançar),
           a URL continua sendo a fonte da verdade. */
        if (!location.hash && armazenamento) {
            const ultimaRota = armazenamento.lerPreferencia("ultima-rota", null);
            if (ultimaRota && registroRotas[ultimaRota]) rotaInicial = ultimaRota;
        }

        history.replaceState({ rota: rotaInicial }, "", `#${rotaInicial}`);
        renderizar(rotaInicial, { semFoco: true, semRolagem: true });
    }

    return { inicializar, irPara };
})();
