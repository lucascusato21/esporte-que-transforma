/* Sem JavaScript, os links permanecem visíveis. */
(() => {
    const nav = document.querySelector(".navegacao");
    if (!nav) return;
    const toggle = nav.querySelector(".menu-toggle");
    const menu = nav.querySelector(".menu");
    const subToggle = nav.querySelector(".submenu-toggle");
    const submenu = nav.querySelector(".submenu");
    const item = nav.querySelector(".item-submenu");
    /* Mesmo limite de 768px do CSS (css/navegacao.css usa
       "@media (min-width: 768px)" para o layout de desktop).
       Usar a negação da MESMA consulta — em vez de uma segunda
       consulta independente com "max-width" — garante que não
       exista nenhuma largura (nem fracionária) em que CSS e
       JavaScript discordem sobre qual layout está ativo. */
    const desktop = window.matchMedia("(min-width: 768px)");

    if (!toggle || !menu) return;

    function setSubmenu(open) {
        if (!submenu || !subToggle) return;
        submenu.hidden = !open;
        subToggle.setAttribute("aria-expanded", String(open));
    }
    function setMenu(open) {
        menu.classList.toggle("aberto", open);
        toggle.setAttribute("aria-expanded", String(open));
        if (!open) setSubmenu(false);
    }
    toggle.hidden = false;
    if (subToggle) subToggle.hidden = false;
    setSubmenu(false);
    nav.classList.add("navegacao-pronta");

    toggle.addEventListener("click", () => {
        setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    if (subToggle) {
        subToggle.addEventListener("click", () => {
            setSubmenu(subToggle.getAttribute("aria-expanded") !== "true");
        });
    }
    nav.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        if (submenu && !submenu.hidden) {
            event.preventDefault();
            setSubmenu(false);
            subToggle.focus();
        } else if (!desktop.matches && menu.classList.contains("aberto")) {
            event.preventDefault();
            setMenu(false);
            toggle.focus();
        }
    });
    document.addEventListener("click", (event) => {
        if (item && !item.contains(event.target)) {
            if (submenu && submenu.contains(document.activeElement)) subToggle.focus();
            setSubmenu(false);
        }
        if (!nav.contains(event.target) && !desktop.matches) {
            if (menu.contains(document.activeElement)) toggle.focus();
            setMenu(false);
        }
    });
    document.addEventListener("focusin", (event) => {
        if (item && !item.contains(event.target)) setSubmenu(false);
        if (!nav.contains(event.target) && !desktop.matches) setMenu(false);
    });
    menu.addEventListener("click", (event) => {
        if (!event.target.closest("a")) return;
        if (!desktop.matches) {
            setMenu(false);
            toggle.focus();
        } else {
            if (submenu && submenu.contains(event.target)) subToggle.focus();
            setSubmenu(false);
        }
    });
    desktop.addEventListener("change", () => {
        if (!desktop.matches && menu.contains(document.activeElement)) toggle.focus();
        if (desktop.matches && document.activeElement === toggle) menu.querySelector("a").focus();
        if (submenu && submenu.contains(document.activeElement)) subToggle.focus();
        setMenu(false);
    });
})();
