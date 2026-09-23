/* =========================================================
   TEMPLATES — dados e funções de renderização das páginas
   Cada função devolve uma string HTML (Template Literals) para
   ser injetada em #app por js/navegacao.js. Os cartões de projeto
   nunca são digitados à mão mais de uma vez: tanto a página
   inicial quanto a página de projetos leem do mesmo array
   PROJETOS e usam map()/join("") para montar os cartões.
   ========================================================= */
window.ONG = window.ONG || {};

window.ONG.templates = (function () {
    "use strict";

    const componentes = window.ONG.componentes;
    const formularios = window.ONG.formularios;

    /* Escapa texto que vem de fora do projeto (ex.: rascunho salvo
       pelo usuário) antes de inserir dentro de um template literal.
       innerHTML só é usado para HTML interno e controlado abaixo. */
    function escaparHTML(texto) {
        const div = document.createElement("div");
        div.textContent = texto == null ? "" : String(texto);
        return div.innerHTML;
    }

    /* =====================================================
       DADOS DOS PROJETOS
       ===================================================== */
    const PROJETOS = [
        {
            id: "beach-tennis-para-todos",
            titulo: "Beach Tennis para Todos",
            categoria: "Esporte",
            badgeClasse: "badge-esporte",
            resumo: "Aulas gratuitas e inclusivas de beach tennis que estimulam movimento, coordenação, saúde e convivência entre crianças e adolescentes.",
            imagem: "imagens/ong-esporte-desktop.webp",
            imagemAlt: "Crianças participando de uma aula de beach tennis",
            figcaption: "Movimento, diversão e inclusão para todos.",
            introducao: "Aulas gratuitas e inclusivas que usam o beach tennis para promover saúde, convivência e novas oportunidades.",
            colunaEsquerdaTitulo: "O propósito",
            colunaEsquerdaHTML: `<p>O projeto oferece acesso ao beach tennis para crianças e adolescentes, independentemente de sua experiência ou condição financeira.</p><p>Na areia, cada participante desenvolve coordenação motora, equilíbrio, agilidade e hábitos saudáveis em um ambiente seguro e acolhedor.</p>`,
            colunaDireitaTitulo: "Como são as aulas",
            colunaDireitaHTML: `<ul><li>Iniciação ao beach tennis de forma lúdica;</li><li>Exercícios de movimento, equilíbrio e coordenação;</li><li>Atividades em duplas e em grupo;</li><li>Acompanhamento de educadores e voluntários;</li><li>Respeito ao ritmo e às necessidades de cada participante.</li></ul>`,
            impactoTitulo: "Mais do que aprender um esporte",
            impactoHTML: `<p>O beach tennis ajuda cada criança e adolescente a perceber suas próprias capacidades, lidar com desafios e construir vínculos positivos. O jogo ensina cooperação, respeito às regras, concentração e confiança.</p>`,
            ctaTexto: "Quero participar"
        },
        {
            id: "beach-tenistas-cidadaos",
            titulo: "Beach Tenistas Cidadãos",
            categoria: "Cidadania",
            badgeClasse: "badge-cidadania",
            resumo: "Aulas, cursos e workshops que fortalecem autoestima, disciplina, cidadania e autonomia, com atividades interativas para as crianças e os adolescentes.",
            imagem: "imagens/ong-esporte-desktop.webp",
            imagemAlt: "Jovens participando de uma atividade esportiva em grupo",
            figcaption: "Aprender, participar e construir cidadania.",
            introducao: "Formação para que crianças e adolescentes aprendam, criem, participem e se reconheçam como agentes de transformação.",
            colunaEsquerdaTitulo: "Formação completa",
            colunaEsquerdaHTML: `<p>O projeto combina aulas de beach tennis com cursos e workshops sobre cidadania, saúde, convivência, liderança e planejamento.</p><p>As atividades são adaptadas à idade dos participantes e valorizam perguntas, ideias e experiências trazidas pelo grupo.</p>`,
            colunaDireitaTitulo: "Atividades interativas",
            colunaDireitaHTML: `<ul><li>Dinâmicas de cooperação e tomada de decisão;</li><li>Workshops com convidados da comunidade;</li><li>Conversas sobre direitos, respeito e responsabilidade;</li><li>Desafios criativos ligados ao beach tennis;</li><li>Momentos para apresentar ideias e projetos.</li></ul>`,
            impactoTitulo: "Crianças e adolescentes como protagonistas",
            impactoHTML: `<p>O objetivo é que os participantes não sejam apenas espectadores. Eles ajudam a construir atividades, compartilham o que aprenderam e desenvolvem autonomia para colaborar com a comunidade.</p>`,
            ctaTexto: "Quero participar"
        },
        {
            id: "rede-solidaria",
            titulo: "Rede Solidária",
            categoria: "Solidariedade",
            badgeClasse: "badge-solidariedade",
            resumo: "As crianças e os adolescentes participam da organização de eventos e torneios e realizam palestras para arrecadar fundos destinados a outras ONGs.",
            imagem: "imagens/ong-esporte-desktop.webp",
            imagemAlt: "Grupo de crianças e adolescentes reunido em uma atividade esportiva",
            figcaption: "Solidariedade que vai além da quadra.",
            introducao: "Um projeto de protagonismo em que crianças e adolescentes transformam o que aprendem em ações de solidariedade.",
            colunaEsquerdaTitulo: "Ações organizadas pelo grupo",
            colunaEsquerdaHTML: `<ul><li>Planejamento e organização de eventos;</li><li>Realização de torneios de beach tennis;</li><li>Campanhas de arrecadação de fundos;</li><li>Divulgação das ações na comunidade;</li><li>Escolha coletiva de instituições para apoiar.</li></ul>`,
            colunaDireitaTitulo: "Palestras e comunicação",
            colunaDireitaHTML: `<p>Os próprios participantes preparam e apresentam palestras para explicar os projetos, mobilizar doadores e mostrar por que é importante ajudar outras organizações sociais.</p><p>Assim, desenvolvem comunicação, liderança, responsabilidade e empatia.</p>`,
            impactoTitulo: "Solidariedade que vai além da quadra",
            impactoHTML: `<p>Os recursos arrecadados são destinados a outras ONGs e iniciativas sociais, ampliando o impacto da rede. As crianças e os adolescentes aprendem que podem contribuir para transformar realidades além da própria comunidade.</p>`,
            ctaTexto: "Quero apoiar a rede"
        }
    ];

    function buscarProjeto(id) {
        return PROJETOS.find((p) => p.id === id) || null;
    }

    /* Cartão usado na página inicial ("Como fazemos"). */
    function cartaoInicioHTML(p) {
        return `<article class="cartao" data-projeto-id="${p.id}">${componentes.badgeHTML(p.categoria, p.badgeClasse)}<h3>${p.titulo}</h3><p>${p.resumo}</p>${componentes.botaoFavoritoHTML(p.id, p.titulo)}<a class="cartao-link" href="#${p.id}" data-rota="${p.id}">Saiba mais</a></article>`;
    }

    /* Cartão usado na página "Projetos" (link com seta). */
    function cartaoProjetosHTML(p) {
        return `<article class="cartao" data-projeto-id="${p.id}">${componentes.badgeHTML(p.categoria, p.badgeClasse)}<h3>${p.titulo}</h3><p>${p.resumo}</p>${componentes.botaoFavoritoHTML(p.id, p.titulo)}<a class="botao botao-projeto" href="#${p.id}" data-rota="${p.id}">Conheça o projeto <span aria-hidden="true">→</span></a></article>`;
    }

    /* =====================================================
       HERO DA PÁGINA INICIAL (carrossel)
       ===================================================== */
    const HERO_SLIDES = [
        { arquivo: "hero-01-acao-menina", alt: "Menina participando de uma atividade de beach tennis", eager: true },
        { arquivo: "hero-02-coach-menino", alt: "Educador acompanhando um menino em uma atividade de beach tennis", eager: false },
        { arquivo: "hero-03-grupo", alt: "Grupo de crianças e adolescentes reunido em uma atividade de beach tennis", eager: false },
        { arquivo: "hero-04-acao-menino", alt: "Menino participando de uma atividade de beach tennis", eager: false }
    ];

    function heroSlideHTML(slide, index) {
        const a = slide.arquivo;
        const ativo = index === 0 ? " ativo" : "";
        const loading = slide.eager ? "eager" : "lazy";
        return `<picture class="hero-slide${ativo}" data-slide aria-label="Imagem ${index + 1} de ${HERO_SLIDES.length}">
            <source type="image/webp" srcset="imagens/inicio/webp/${a}-mobile.webp 480w, imagens/inicio/webp/${a}-tablet.webp 768w, imagens/inicio/webp/${a}-laptop.webp 1280w, imagens/inicio/webp/${a}-desktop.webp 1600w" sizes="100vw">
            <img src="imagens/inicio/jpg/${a}-laptop.jpg" srcset="imagens/inicio/jpg/${a}-mobile.jpg 480w, imagens/inicio/jpg/${a}-tablet.jpg 768w, imagens/inicio/jpg/${a}-laptop.jpg 1280w, imagens/inicio/jpg/${a}-desktop.jpg 1600w" sizes="100vw" alt="${slide.alt}" width="1600" height="900" loading="${loading}" decoding="async">
        </picture>`;
    }

    function heroIndicadorHTML(index) {
        const ativo = index === 0 ? " ativo" : "";
        const selecionado = index === 0 ? "true" : "false";
        return `<button class="hero-indicador${ativo}" type="button" data-slide-control="${index}" role="tab" aria-label="Mostrar imagem ${index + 1}" aria-selected="${selecionado}"></button>`;
    }

    /* =====================================================
       PÁGINA INICIAL
       ===================================================== */
    function paginaInicio() {
        return `
        <section class="hero" aria-labelledby="titulo-principal">
            <div class="container">
                <div class="hero-caixa" data-carrossel aria-roledescription="carrossel" aria-label="Imagens da Esporte que Transforma">
                    <div class="hero-slides">
                        ${HERO_SLIDES.map(heroSlideHTML).join("")}
                    </div>
                    <div class="hero-controles" aria-label="Controles das imagens">
                        <button class="hero-seta" type="button" data-anterior aria-label="Imagem anterior">&#8592;</button>
                        <div class="hero-indicadores" role="tablist" aria-label="Escolha uma imagem">
                            ${HERO_SLIDES.map((s, i) => heroIndicadorHTML(i)).join("")}
                        </div>
                        <button class="hero-seta" type="button" data-proxima aria-label="Próxima imagem">&#8594;</button>
                    </div>
                    <div class="hero-texto">
                        <p class="hero-etiqueta">Esporte, cidadania e futuro</p>
                        <h1 id="titulo-principal">O beach tennis abre caminhos e transforma vidas</h1>
                        <p>Uma iniciativa social que transforma a areia em espaço de aprendizagem, pertencimento e novas oportunidades.</p>
                        <div class="hero-acoes">
                            <a class="botao" href="#cadastro-participante" data-rota="cadastro-participante">Quero participar</a>
                            <a class="botao botao-historia" href="#historia">Conheça nossa história</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="impacto" aria-labelledby="titulo-impacto">
            <div class="container">
                <div class="secao-chamada">
                    <p class="etiqueta">Nosso impacto em movimento</p>
                    <h2 id="titulo-impacto">Uma rede com diferentes formas de transformar</h2>
                </div>
                <div class="impacto-grade">
                    <div class="numero-impacto"><strong>3</strong><span>projetos que conectam esporte e cidadania</span></div>
                    <div class="numero-impacto"><strong>100%</strong><span>do foco dedicado ao beach tennis</span></div>
                    <div class="numero-impacto"><strong>1</strong><span>rede solidária para apoiar outras ONGs</span></div>
                    <div class="numero-impacto"><strong>3</strong><span>caminhos para participar e colaborar</span></div>
                </div>
            </div>
        </section>

        <section class="secao clara" id="historia" aria-labelledby="titulo-historia">
            <div class="container historia-grid">
                <div class="secao-chamada">
                    <p class="etiqueta">De onde viemos</p>
                    <h2 id="titulo-historia">Uma ideia que nasceu para abrir espaço</h2>
                </div>
                <div class="texto-historia">
                    <p>A Esporte que Transforma nasceu da vontade de criar oportunidades reais para crianças e adolescentes por meio de um esporte acessível, coletivo e cheio de possibilidades.</p>
                    <p>Escolhemos o beach tennis porque ele aproxima as pessoas, incentiva a cooperação e permite que cada participante evolua no seu próprio ritmo. A quadra é o ponto de partida para conversas, vínculos e escolhas mais conscientes.</p>
                    <p>Hoje, o projeto reúne aulas, formação cidadã e ações solidárias para que os jovens também sejam protagonistas das mudanças que desejam ver na comunidade.</p>
                </div>
            </div>
        </section>

        <section class="secao" aria-labelledby="titulo-proposito">
            <div class="container proposito-grid">
                <article class="proposito-bloco">
                    <p class="etiqueta">Nossa missão</p>
                    <h2 id="titulo-proposito">Transformar esporte em oportunidade</h2>
                    <p>Oferecer acesso gratuito ao beach tennis e a experiências de educação, convivência e solidariedade que ampliem os horizontes de crianças e adolescentes.</p>
                </article>
                <div class="valores-bloco">
                    <p class="etiqueta">Nossos valores</p>
                    <div class="valores-lista">
                        <div><strong>Inclusão</strong><span>Todo mundo merece espaço para aprender e participar.</span></div>
                        <div><strong>Respeito</strong><span>Escutamos histórias, ritmos e diferenças.</span></div>
                        <div><strong>Protagonismo</strong><span>Jovens também criam, lideram e transformam.</span></div>
                        <div><strong>Solidariedade</strong><span>O impacto cresce quando chega a mais pessoas.</span></div>
                    </div>
                </div>
            </div>
        </section>

        <section class="secao clara" aria-labelledby="titulo-atuacao">
            <div class="container atuacao-grid">
                <div>
                    <p class="etiqueta">Onde atuamos</p>
                    <h2 id="titulo-atuacao">Na quadra, na comunidade e em rede</h2>
                    <p>As ações acontecem em espaços de prática de beach tennis e se expandem para escolas, eventos, encontros e parcerias com organizações sociais.</p>
                </div>
                <ul class="atuacao-lista">
                    <li><strong>Quadras e aulas</strong><span>Atividades regulares de beach tennis com acompanhamento.</span></li>
                    <li><strong>Formação</strong><span>Cursos, workshops e palestras interativas.</span></li>
                    <li><strong>Eventos</strong><span>Torneios e encontros organizados com participação dos jovens.</span></li>
                    <li><strong>Rede solidária</strong><span>Ações de arrecadação e apoio a outras ONGs.</span></li>
                </ul>
            </div>
        </section>

        <section class="secao" aria-labelledby="titulo-iniciativas">
            <div class="container">
                <div class="centro">
                    <p class="etiqueta">Como fazemos</p>
                    <h2 id="titulo-iniciativas">Três projetos, um mesmo propósito</h2>
                    <p>Cada frente atua de um jeito, mas todas usam o beach tennis para criar desenvolvimento, cidadania e solidariedade.</p>
                </div>
                <div class="grade">
                    ${PROJETOS.map(cartaoInicioHTML).join("")}
                </div>
            </div>
        </section>

        <section class="chamada-final" id="contato" aria-labelledby="titulo-contato">
            <div class="container chamada-final-grid">
                <div><p class="etiqueta">Faça parte</p><h2 id="titulo-contato">Toda transformação começa com uma escolha</h2><p>Você pode participar de um projeto, ser voluntário ou fortalecer a rede com uma doação.</p></div>
                <div class="chamada-acoes"><a class="botao botao-amarelo" href="#cadastro" data-rota="cadastro">Escolher como participar</a><a class="botao botao-amarelo" href="#doacao" data-rota="doacao">Apoiar com uma doação</a></div>
            </div>
        </section>`;
    }

    /* =====================================================
       PÁGINA PROJETOS
       ===================================================== */
    function paginaProjetos() {
        return `
        <figure class="projeto-imagem">
            <picture>
                <source media="(max-width: 600px)" srcset="imagens/ong-esporte-mobile.webp" type="image/webp">
                <source media="(max-width: 1024px)" srcset="imagens/ong-esporte-tablet.webp" type="image/webp">
                <img src="imagens/ong-esporte-desktop.webp" alt="Crianças e adolescentes participando de uma atividade de beach tennis" width="1600" height="900">
            </picture>
            <figcaption>Projetos que começam na areia e chegam à comunidade.</figcaption>
        </figure>
        <section class="introducao" aria-labelledby="titulo-principal">
            <h1 id="titulo-principal">Beach tennis que transforma vidas</h1>
            <p>Usamos o beach tennis como ferramenta de inclusão, educação e desenvolvimento para crianças e adolescentes.</p>
        </section>

        <section aria-labelledby="titulo-projetos">
            <div class="cabecalho-projetos">
                <h2 id="titulo-projetos">Nossos projetos</h2>
                <div class="acoes-favoritos">
                    <button type="button" class="botao-filtro-favoritos" data-filtro-favoritos aria-pressed="false">Mostrar somente favoritos</button>
                    <button type="button" class="botao-limpar-favoritos" data-limpar-favoritos${componentes.listarFavoritos().length ? "" : " hidden"}>Limpar favoritos</button>
                </div>
            </div>
            ${componentes.alertaHTML("informacao", 'Você ainda não salvou nenhum projeto como favorito. Toque em "Salvar projeto" em um cartão e use este filtro para encontrá-lo depois.', ' data-favoritos-vazio hidden role="status" aria-live="polite"')}
            <div class="grade" data-grade-projetos>
                ${PROJETOS.map(cartaoProjetosHTML).join("")}
            </div>
        </section>

        <div class="duas-colunas">
            <section id="voluntariado-resumo" class="bloco" aria-labelledby="titulo-voluntariado">
                <h2 id="titulo-voluntariado">Trabalho voluntário</h2>
                <p>Os voluntários ajudam a tornar os projetos de beach tennis acolhedores, seguros e acessíveis para todos os participantes.</p>
                <h3>Formas de participação</h3>
                <ul>
                    <li>Apoio nas aulas e nos treinos de beach tennis;</li>
                    <li>Organização de eventos e torneios;</li>
                    <li>Divulgação dos projetos;</li>
                    <li>Apoio em cursos, workshops e palestras;</li>
                    <li>Apoio administrativo e tecnológico.</li>
                </ul>
                <a class="botao" href="#cadastro" data-rota="cadastro">Quero ser voluntário</a>
            </section>

            <section id="doacoes-resumo" class="bloco" aria-labelledby="titulo-doacoes">
                <h2 id="titulo-doacoes">Campanhas de doação</h2>
                <p>As contribuições ajudam a manter as aulas de beach tennis, comprar equipamentos adequados e oferecer uma estrutura segura para crianças e adolescentes.</p>
                <h3>Como contribuir</h3>
                <ul>
                    <li>Doação financeira;</li>
                    <li>Raquetes, bolas e redes de beach tennis;</li>
                    <li>Protetor solar, bonés e garrafas de água;</li>
                    <li>Alimentos e produtos de higiene;</li>
                    <li>Patrocínio de atividades;</li>
                    <li>Parcerias com empresas.</li>
                </ul>
                <a class="botao" href="#doacao" data-rota="doacao">Quero fazer uma doação</a>
            </section>
        </div>

        <section class="bloco" aria-labelledby="titulo-participacao">
            <h2 id="titulo-participacao">Faça parte dessa transformação</h2>
            <p>Seja por meio de uma doação, parceria ou trabalho voluntário, toda contribuição fortalece os projetos e amplia o atendimento à comunidade.</p>
            <a class="botao" href="#cadastro" data-rota="cadastro">Preencher cadastro</a>
        </section>`;
    }

    /* =====================================================
       PÁGINA DE CADA PROJETO
       ===================================================== */
    function paginaProjetoDetalhe(id) {
        const p = buscarProjeto(id);
        if (!p) return null;
        return `
        <figure class="projeto-imagem">
            <picture>
                <source media="(max-width: 600px)" srcset="imagens/ong-esporte-mobile.webp" type="image/webp">
                <source media="(max-width: 1024px)" srcset="imagens/ong-esporte-tablet.webp" type="image/webp">
                <img src="${p.imagem}" alt="${p.imagemAlt}" width="1600" height="900">
            </picture>
            <figcaption>${p.figcaption}</figcaption>
        </figure>
        <section class="introducao" aria-labelledby="titulo-principal">
            <h1 id="titulo-principal">${p.titulo}</h1>
            <p>${p.introducao}</p>
        </section>
        <div class="duas-colunas">
            <section class="bloco" aria-labelledby="titulo-coluna-esquerda">
                <h2 id="titulo-coluna-esquerda">${p.colunaEsquerdaTitulo}</h2>
                ${p.colunaEsquerdaHTML}
            </section>
            <section class="bloco" aria-labelledby="titulo-coluna-direita">
                <h2 id="titulo-coluna-direita">${p.colunaDireitaTitulo}</h2>
                ${p.colunaDireitaHTML}
            </section>
        </div>
        <section class="bloco" aria-labelledby="titulo-impacto-projeto">
            <h2 id="titulo-impacto-projeto">${p.impactoTitulo}</h2>
            ${p.impactoHTML}
            <a class="botao" href="#cadastro" data-rota="cadastro">${p.ctaTexto}</a>
        </section>`;
    }

    /* =====================================================
       PÁGINA VOLUNTARIADO
       ===================================================== */
    function paginaVoluntariado() {
        return `
        <figure class="projeto-imagem">
            <picture>
                <source media="(max-width: 600px)" srcset="imagens/ong-esporte-mobile.webp" type="image/webp">
                <source media="(max-width: 1024px)" srcset="imagens/ong-esporte-tablet.webp" type="image/webp">
                <img src="imagens/ong-esporte-desktop.webp" alt="Voluntários acompanhando crianças e adolescentes em uma atividade esportiva" width="1600" height="900">
            </picture>
            <figcaption>Faça parte da transformação.</figcaption>
        </figure>
        <section class="introducao" aria-labelledby="titulo-principal">
            <h1 id="titulo-principal">Seu tempo pode transformar caminhos</h1>
            <p>Na Esporte que Transforma, cada pessoa voluntária contribui para criar ambientes seguros, acolhedores e cheios de oportunidades para crianças e adolescentes.</p>
            <a class="botao" href="#cadastro" data-rota="cadastro">Quero ser voluntário</a>
        </section>

        <section aria-labelledby="titulo-atuacao-voluntario">
            <h2 id="titulo-atuacao-voluntario">Como você pode participar</h2>
            <div class="grade">
                <article class="cartao">
                    <h3>Atividades esportivas</h3>
                    <p>Apoie educadores durante treinos, brincadeiras e aulas, ajudando na organização e na inclusão dos participantes.</p>
                </article>
                <article class="cartao">
                    <h3>Oficinas e encontros</h3>
                    <p>Compartilhe conhecimentos em oficinas de cidadania, saúde, educação, tecnologia, arte ou outras áreas.</p>
                </article>
                <article class="cartao">
                    <h3>Campanhas e eventos</h3>
                    <p>Colabore na divulgação, na arrecadação de doações, na recepção de famílias e na organização dos eventos.</p>
                </article>
            </div>
        </section>

        <div class="duas-colunas">
            <section class="bloco" aria-labelledby="titulo-rotina">
                <h2 id="titulo-rotina">Como funciona</h2>
                <ol>
                    <li>Preencha o cadastro com seus interesses e disponibilidade.</li>
                    <li>Nossa equipe entra em contato para conhecer melhor seu perfil.</li>
                    <li>Combinamos a atividade, os horários e as orientações necessárias.</li>
                    <li>Você começa a colaborar acompanhado pela equipe da ONG.</li>
                </ol>
            </section>

            <section class="bloco" aria-labelledby="titulo-perfil">
                <h2 id="titulo-perfil">Quem pode ser voluntário?</h2>
                <p>Qualquer pessoa maior de 18 anos que queira contribuir com responsabilidade, respeito e disposição para trabalhar em equipe.</p>
                <p>Não é necessário ter experiência anterior. O mais importante é respeitar as crianças, os adolescentes e a comunidade atendida.</p>
                <a class="botao" href="#cadastro" data-rota="cadastro">Preencher cadastro</a>
            </section>
        </div>

        <section class="bloco" aria-labelledby="titulo-duvidas">
            <h2 id="titulo-duvidas">Tem dúvidas antes de participar?</h2>
            <p>Fale com a nossa equipe para saber quais atividades estão abertas, quais documentos são necessários e como funciona a integração de novos voluntários.</p>
            <p><strong>E-mail:</strong> <a href="mailto:contato@esportequetransforma.org.br">contato@esportequetransforma.org.br</a> &nbsp; <strong>Telefone:</strong> <a href="tel:+551140001234">(11) 4000-1234</a></p>
        </section>`;
    }

    /* =====================================================
       PÁGINA DOAÇÃO
       ===================================================== */
    function paginaDoacao() {
        return `
        <section class="doacao-hero" aria-labelledby="titulo-principal">
            <div class="container hero-grid">
                <div class="hero-conteudo">
                    <p class="etiqueta">Rede solidária</p>
                    <h1 id="titulo-principal">Sua doação coloca oportunidades em movimento</h1>
                    <p>Com a sua ajuda, mantemos atividades esportivas gratuitas, compramos materiais e ampliamos o atendimento a crianças e adolescentes.</p>
                    <div class="hero-acoes">
                        <a class="botao" href="#doacao-financeira">Doar agora</a>
                        <a class="botao botao-contorno" href="#materiais">Ver materiais aceitos</a>
                    </div>
                </div>
                <figure class="hero-imagem">
                    <picture>
                        <source media="(max-width: 600px)" srcset="imagens/ong-esporte-mobile.webp" type="image/webp">
                        <source media="(max-width: 1024px)" srcset="imagens/ong-esporte-tablet.webp" type="image/webp">
                        <img src="imagens/ong-esporte-desktop.webp" alt="Grupo de crianças participando de uma atividade de beach tennis com um educador" width="1600" height="900">
                    </picture>
                    <figcaption>Juntos, criamos caminhos para o futuro.</figcaption>
                </figure>
            </div>
        </section>

        <section class="secao" id="doacao-financeira" aria-labelledby="titulo-financeira">
            <div class="container">
                <div class="secao-cabecalho">
                    <p class="etiqueta">Contribuição financeira</p>
                    <h2 id="titulo-financeira">Doe do jeito que for melhor para você</h2>
                    <p>Qualquer valor ajuda a manter nossos projetos ativos. Para facilitar, disponibilizamos Pix e atendimento para outras formas de contribuição.</p>
                </div>
                <div class="formas-doacao">
                    <article class="forma-destaque">
                        <p class="numero-forma">01</p>
                        <h3>Pix</h3>
                        <p>Use nossa chave Pix por e-mail:</p>
                        <div class="pix-controle">
                            <p class="chave-pix">contato@esportequetransforma.org.br</p>
                            <button class="botao-copiar" type="button" data-copiar-pix="contato@esportequetransforma.org.br">Copiar Pix</button>
                        </div>
                        <p class="status-interacao" data-pix-status aria-live="polite"></p>
                        <p class="nota">Depois de doar, envie o comprovante para facilitar a identificação e o agradecimento.</p>
                        <a class="botao" href="mailto:contato@esportequetransforma.org.br?subject=Comprovante%20de%20doacao">Enviar comprovante</a>
                    </article>
                    <article class="forma-doacao">
                        <p class="numero-forma">02</p>
                        <h3>Transferência ou depósito</h3>
                        <p>Fale com a equipe para receber os dados bancários atualizados e as orientações para identificar sua contribuição.</p>
                        <a class="link-seta" href="mailto:contato@esportequetransforma.org.br?subject=Dados%20para%20doacao">Solicitar dados bancários <span aria-hidden="true">→</span></a>
                    </article>
                    <article class="forma-doacao">
                        <p class="numero-forma">03</p>
                        <h3>Doação recorrente</h3>
                        <p>Uma contribuição mensal ajuda a planejar as atividades, comprar materiais e manter o atendimento durante todo o ano.</p>
                        <a class="link-seta" href="mailto:contato@esportequetransforma.org.br?subject=Doacao%20recorrente">Quero contribuir mensalmente <span aria-hidden="true">→</span></a>
                    </article>
                </div>
            </div>
        </section>

        <section class="secao faixa-clara" id="materiais" aria-labelledby="titulo-materiais">
            <div class="container materiais-grid">
                <div>
                    <p class="etiqueta">Doação de itens</p>
                    <h2 id="titulo-materiais">Materiais que fazem a diferença</h2>
                    <p>Aceitamos itens novos ou usados em bom estado, higienizados e seguros para uso. Antes de levar materiais volumosos, confirme a necessidade com a equipe.</p>
                    <a class="botao" href="#entrega">Ver como entregar</a>
                </div>
                <div class="lista-materiais">
                    <div class="lista-bloco">
                        <h3>Esporte e atividades</h3>
                        <ul>
                            <li>Raquetes e bolas próprias para beach tennis</li>
                            <li>Redes, postes, fitas de demarcação e cones</li>
                            <li>Coletes, bonés e toalhas para as atividades</li>
                            <li>Garrafas de água, caixas térmicas e bolsas esportivas</li>
                        </ul>
                    </div>
                    <div class="lista-bloco">
                        <h3>Apoio aos projetos</h3>
                        <ul>
                            <li>Alimentos não perecíveis</li>
                            <li>Materiais escolares e de escritório</li>
                            <li>Produtos de higiene e limpeza</li>
                            <li>Computadores e periféricos em funcionamento</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="secao" id="entrega" aria-labelledby="titulo-entrega">
            <div class="container duas-colunas-doacao">
                <article class="bloco-doacao">
                    <p class="etiqueta">Entrega de materiais</p>
                    <h2 id="titulo-entrega">Combine antes de trazer</h2>
                    <p>Assim conseguimos organizar o recebimento e confirmar se o item atende a uma necessidade atual.</p>
                    <address>
                        <span><strong>Local:</strong> Rua da Cidadania, 100 – São Paulo/SP</span>
                        <span><strong>Atendimento:</strong> segunda a sexta, das 9h às 17h</span>
                        <span><strong>Contato:</strong> <a href="tel:+551140001234">(11) 4000-1234</a></span>
                    </address>
                    <a class="link-seta" href="mailto:contato@esportequetransforma.org.br?subject=Entrega%20de%20materiais">Combinar uma entrega <span aria-hidden="true">→</span></a>
                </article>
                <article class="bloco-doacao aviso">
                    <p class="etiqueta">Importante</p>
                    <h2>O que não recebemos</h2>
                    ${componentes.alertaHTML("atencao", "Por segurança e organização, não recebemos itens quebrados, sujos, vencidos, armas, bebidas alcoólicas ou materiais sem condição de uso.")}
                    <p>Tem um item diferente em mente? Entre em contato. A equipe orienta a melhor forma de ajudar.</p>
                </article>
            </div>
        </section>

        <section class="secao faixa-escura" aria-labelledby="titulo-parcerias">
            <div class="container parceria-conteudo">
                <div>
                    <p class="etiqueta">Para empresas e parceiros</p>
                    <h2 id="titulo-parcerias">Apoie uma frente de atuação</h2>
                    <p>Empresas podem patrocinar turmas, campanhas, eventos ou a compra de equipamentos. Montamos uma proposta de parceria de acordo com cada realidade.</p>
                </div>
                <a class="botao botao-amarelo" href="mailto:contato@esportequetransforma.org.br?subject=Parceria%20com%20a%20ONG">Conversar sobre parceria</a>
            </div>
        </section>

        <section class="secao transparencia" aria-labelledby="titulo-transparencia">
            <div class="container transparencia-conteudo">
                <p class="etiqueta">Compromisso</p>
                <h2 id="titulo-transparencia">Sua confiança também transforma</h2>
                <p>Registramos as doações recebidas e direcionamos os recursos para a manutenção dos projetos. Para saber como sua contribuição foi utilizada ou solicitar um recibo, fale com a nossa equipe.</p>
                <div class="contato-final">
                    <a href="mailto:contato@esportequetransforma.org.br">contato@esportequetransforma.org.br</a>
                    <a href="tel:+551140001234">(11) 4000-1234</a>
                </div>
            </div>
        </section>`;
    }

    /* =====================================================
       PÁGINA CADASTRO (escolha)
       ===================================================== */
    function paginaCadastro() {
        return `
        <h1>Escolha seu cadastro</h1>
        <p class="introducao">Existem duas formas de fazer parte da Esporte que Transforma. Escolha o cadastro que combina com você.</p>

        <section class="tipos-cadastro" aria-labelledby="titulo-tipos">
            <h2 id="titulo-tipos">Como você quer participar?</h2>
            <div class="tipos-cadastro-grade">
                <a class="tipo-cadastro" href="#cadastro-voluntario" data-rota="cadastro-voluntario">
                    <span class="tipo-numero">01</span>
                    <h3>Quero ser voluntário</h3>
                    <p>Ajude nas aulas, cursos, workshops, eventos, torneios e ações da ONG.</p>
                    <span class="tipo-link">Abrir cadastro <span aria-hidden="true">→</span></span>
                </a>
                <a class="tipo-cadastro" href="#cadastro-participante" data-rota="cadastro-participante">
                    <span class="tipo-numero">02</span>
                    <h3>Quero participar do projeto</h3>
                    <p>Inscreva uma criança ou adolescente para conhecer as atividades de beach tennis.</p>
                    <span class="tipo-link">Abrir cadastro <span aria-hidden="true">→</span></span>
                </a>
            </div>
        </section>`;
    }

    /* =====================================================
       PÁGINA CADASTRO DE VOLUNTÁRIO
       ===================================================== */
    function paginaCadastroVoluntario() {
        const rascunho = escaparHTML(formularios ? formularios.lerRascunhoMensagem() : "");
        return `
        <h1>Cadastro de voluntário</h1>
        <p class="introducao">Ajude nas aulas, cursos, workshops, eventos, torneios e ações da ONG. Os campos com (*) são obrigatórios.</p>
        ${componentes.alertaHTML("informacao", "Este é um cadastro demonstrativo: os dados não são enviados nem armazenados.", ' role="status"')}
        <form action="#" method="post" novalidate>
            <fieldset>
                <legend>Seus dados</legend>
                <div class="grade">
                    <div class="campo campo-total"><label for="nome">Nome completo *</label><input type="text" id="nome" name="nome" autocomplete="name" minlength="3" required></div>
                    <div class="campo"><label for="email">E-mail *</label><input type="email" id="email" name="email" autocomplete="email" placeholder="nome@exemplo.com" required></div>
                    <div class="campo"><label for="nascimento">Data de nascimento *</label><input type="date" id="nascimento" name="nascimento" required></div>
                    <div class="campo"><label for="cpf">CPF *</label><input type="text" id="cpf" name="cpf" inputmode="numeric" placeholder="000.000.000-00" pattern="[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}-[0-9]{2}" maxlength="14" required></div>
                    <div class="campo"><label for="telefone">Telefone *</label><input type="tel" id="telefone" name="telefone" inputmode="tel" placeholder="(00) 00000-0000" pattern="\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}" maxlength="15" required></div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Como você pode ajudar?</legend>
                <div class="opcoes">
                    <div class="opcao"><input type="checkbox" id="beach-tennis" name="interesses" value="beach-tennis"><label for="beach-tennis">Aulas de beach tennis</label></div>
                    <div class="opcao"><input type="checkbox" id="eventos" name="interesses" value="eventos"><label for="eventos">Eventos e torneios</label></div>
                    <div class="opcao"><input type="checkbox" id="workshops" name="interesses" value="workshops"><label for="workshops">Cursos, workshops e palestras</label></div>
                    <div class="opcao"><input type="checkbox" id="comunicacao" name="interesses" value="comunicacao"><label for="comunicacao">Comunicação e divulgação</label></div>
                </div>
                <div class="campo"><label for="mensagem">Disponibilidade e informações adicionais</label><textarea id="mensagem" name="mensagem" maxlength="500" placeholder="Conte como gostaria de colaborar.">${rascunho}</textarea>
                <span class="ajuda">O texto deste campo fica salvo neste navegador como rascunho enquanto você preenche o formulário (nenhum outro dado é salvo).</span></div>
            </fieldset>
            <fieldset><legend>Consentimento</legend><div class="opcao"><input type="checkbox" id="consentimento" name="consentimento" required><label for="consentimento">Aceito o tratamento dos dados para fins de contato. *</label></div></fieldset>
            <div class="acoes"><button type="submit">Enviar cadastro</button><button type="reset">Limpar formulário</button></div>
            <p class="status-formulario" data-form-status tabindex="-1" aria-live="polite" hidden></p>
        </form>`;
    }

    /* =====================================================
       PÁGINA CADASTRO DE PARTICIPANTE
       ===================================================== */
    function paginaCadastroParticipante() {
        return `
        <h1>Cadastro de participante</h1>
        <p class="introducao">Inscreva uma criança ou adolescente nos projetos de beach tennis. O cadastro deve ser feito por uma pessoa responsável.</p>
        ${componentes.alertaHTML("informacao", "Este é um cadastro demonstrativo: os dados não são enviados nem armazenados.", ' role="status"')}
        <form action="#" method="post" novalidate>
            <fieldset>
                <legend>Dados do participante</legend>
                <div class="grade">
                    <div class="campo campo-total"><label for="participante-nome">Nome completo *</label><input type="text" id="participante-nome" name="participante-nome" minlength="3" required></div>
                    <div class="campo"><label for="participante-nascimento">Data de nascimento *</label><input type="date" id="participante-nascimento" name="participante-nascimento" required></div>
                    <div class="campo"><label for="participante-projeto">Projeto de interesse *</label><select id="participante-projeto" name="participante-projeto" required><option value="">Selecione</option>${PROJETOS.map((p) => `<option value="${p.id}">${p.titulo}</option>`).join("")}</select></div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Dados da pessoa responsável</legend>
                <div class="grade">
                    <div class="campo campo-total"><label for="responsavel-nome">Nome completo *</label><input type="text" id="responsavel-nome" name="responsavel-nome" autocomplete="name" required></div>
                    <div class="campo"><label for="responsavel-email">E-mail *</label><input type="email" id="responsavel-email" name="responsavel-email" autocomplete="email" required></div>
                    <div class="campo"><label for="responsavel-telefone">Telefone *</label><input type="tel" id="responsavel-telefone" name="responsavel-telefone" inputmode="tel" placeholder="(00) 00000-0000" pattern="\\([0-9]{2}\\) [0-9]{5}-[0-9]{4}" maxlength="15" required></div>
                </div>
            </fieldset>
            <fieldset>
                <legend>Consentimento</legend>
                <div class="opcao"><input type="checkbox" id="consentimento-participante" name="consentimento-participante" required><label for="consentimento-participante">Confirmo que sou responsável e autorizo o contato sobre a participação no projeto. *</label></div>
            </fieldset>
            <div class="acoes"><button type="submit">Enviar cadastro</button><button type="reset">Limpar formulário</button></div>
            <p class="status-formulario" data-form-status tabindex="-1" aria-live="polite" hidden></p>
        </form>`;
    }

    /* =====================================================
       PÁGINA DE ERRO (rota não encontrada)
       ===================================================== */
    function paginaErro(rotaBruta) {
        return `
        <section class="secao" aria-labelledby="titulo-erro">
            <h1 id="titulo-erro">Página não encontrada</h1>
            ${componentes.alertaHTML("atencao", `Não encontramos a página "${escaparHTML(rotaBruta)}". Confira o endereço ou volte para o início.`, ' role="status"')}
            <p><a class="botao" href="#inicio" data-rota="inicio">Voltar para o início</a></p>
        </section>`;
    }

    return {
        PROJETOS,
        listarIdsProjetos: () => PROJETOS.map((projeto) => projeto.id),
        buscarProjeto,
        paginaInicio,
        paginaProjetos,
        paginaProjetoDetalhe,
        paginaVoluntariado,
        paginaDoacao,
        paginaCadastro,
        paginaCadastroVoluntario,
        paginaCadastroParticipante,
        paginaErro,
        escaparHTML
    };
})();
