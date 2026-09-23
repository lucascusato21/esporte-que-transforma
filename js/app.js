/* =========================================================
   APP — inicialização geral e conexão dos módulos
   Define o registro de rotas (rota → template + classes de body/
   #app + título da aba) e liga navegação, formulários e
   componentes. Este é o único arquivo que "conhece" todas as
   outras peças; os demais módulos não dependem uns dos outros
   além do necessário.
   ========================================================= */
(function () {
    "use strict";

    function iniciar() {
        const templates = window.ONG.templates;
        const navegacao = window.ONG.navegacao;
        const formularios = window.ONG.formularios;
        const componentes = window.ONG.componentes;

        if (!templates || !navegacao) return; // algum módulo não carregou

        const registroRotas = {
            inicio: {
                render: templates.paginaInicio,
                bodyClasse: "pagina-inicial",
                appClasse: "",
                titulo: "Início"
            },
            projetos: {
                render: templates.paginaProjetos,
                bodyClasse: "pagina-projetos",
                appClasse: "container",
                titulo: "Projetos de Beach Tennis"
            },
            "beach-tennis-para-todos": {
                render: () => templates.paginaProjetoDetalhe("beach-tennis-para-todos"),
                bodyClasse: "pagina-projetos",
                appClasse: "container",
                titulo: "Beach Tennis para Todos"
            },
            "beach-tenistas-cidadaos": {
                render: () => templates.paginaProjetoDetalhe("beach-tenistas-cidadaos"),
                bodyClasse: "pagina-projetos",
                appClasse: "container",
                titulo: "Beach Tenistas Cidadãos"
            },
            "rede-solidaria": {
                render: () => templates.paginaProjetoDetalhe("rede-solidaria"),
                bodyClasse: "pagina-projetos",
                appClasse: "container",
                titulo: "Rede Solidária"
            },
            voluntariado: {
                render: templates.paginaVoluntariado,
                bodyClasse: "pagina-projetos",
                appClasse: "container",
                titulo: "Voluntariado"
            },
            doacao: {
                render: templates.paginaDoacao,
                bodyClasse: "pagina-doacao",
                appClasse: "",
                titulo: "Faça uma doação"
            },
            cadastro: {
                render: templates.paginaCadastro,
                bodyClasse: "pagina-cadastro",
                appClasse: "container pagina-escolha",
                titulo: "Cadastro"
            },
            "cadastro-voluntario": {
                render: templates.paginaCadastroVoluntario,
                bodyClasse: "pagina-cadastro",
                appClasse: "container",
                titulo: "Cadastro de voluntário"
            },
            "cadastro-participante": {
                render: templates.paginaCadastroParticipante,
                bodyClasse: "pagina-cadastro",
                appClasse: "container",
                titulo: "Cadastro de participante"
            }
        };

        if (componentes) {
            if (componentes.configurarFavoritos && templates.listarIdsProjetos) {
                componentes.configurarFavoritos(templates.listarIdsProjetos());
            }
            componentes.inicializarToast();
            componentes.inicializarCopiaPix();
            componentes.inicializarFavoritos();
        }
        if (formularios) {
            formularios.inicializar("#app");
        }

        navegacao.inicializar(registroRotas, { rotaPadrao: "inicio" });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
