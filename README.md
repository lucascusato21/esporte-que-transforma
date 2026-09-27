# Esporte que Transforma

Projeto acadêmico de desenvolvimento front-end de um site para uma ONG de inclusão social por meio do beach tennis, desenvolvido no curso de Análise e Desenvolvimento de Sistemas.

## Funcionalidades presentes

- Navegação SPA: o conteúdo de `main#app` é atualizado sem recarregar o documento.
- Página inicial com carrossel, projetos e seus detalhes, voluntariado, doações e cadastros.
- Formulários demonstrativos com validação, máscaras e mensagens de orientação; sem envio a um servidor.
- Cópia da chave Pix com feedback visual.
- Projetos favoritos: salvar, remover, filtrar e limpar a seleção.
- Recuperação da última rota e de um rascunho do formulário de voluntariado.

## Tecnologias e arquitetura

HTML5, CSS3 e JavaScript, sem framework, com Vite como ferramenta de desenvolvimento e build. A única dependência NPM é o Vite, instalada para desenvolvimento. Os módulos mantêm suas responsabilidades e o namespace `window.ONG`; `js/main.js` os importa na ordem necessária.

O `index.html` é a entrada do Vite e carrega `js/main.js` como módulo. O módulo `app.js` reúne as rotas e inicializa navegação, formulários e componentes. A URL utiliza fragmentos, como `/#projetos`, com integração ao histórico do navegador.

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Entrada da SPA, cabeçalho, navegação, rodapé e região de notificações |
| `css/` | Estilos gerais, componentes e páginas |
| `js/app.js` | Inicialização e registro de rotas |
| `js/main.js` | Ponto de entrada que importa os módulos da aplicação na ordem necessária |
| `vite.config.js` | Configuração Vite e cópia das imagens usadas por caminhos dinâmicos na build |
| `js/templates.js` | Dados dos projetos e geração do conteúdo das páginas |
| `js/navegacao.js` | Navegação, histórico, foco e menus |
| `js/formularios.js` | Validação, máscaras e rascunho |
| `js/armazenamento.js` | Leitura, gravação e remoção no localStorage |
| `js/componentes.js` | Favoritos, alertas, toast e cópia do Pix |
| `js/carrossel.js` | Carrossel da página inicial |
| `imagens/` | Fotografias e identidade visual em diferentes tamanhos e formatos |
| `html/` | Páginas anteriores à SPA, preservadas como referência |
| `js/menu.js` e `js/interacoes.js` | Scripts das páginas anteriores |
| `capturas-teste/` | Evidências e anotações recebidas junto ao projeto; não representam novos testes nesta preparação |

## Executar localmente

1. Instale Git e Node.js (inclui npm) e clone o repositório:

```bash
git clone https://github.com/lucascusato21/esporte-que-transforma.git
cd esporte-que-transforma
```

2. Instale as dependências e inicie o servidor de desenvolvimento na raiz:

```bash
npm install
npm run dev
```

3. Abra a URL local informada pelo Vite (por padrão, `http://localhost:5173`). Encerre o servidor com `Ctrl+C`.

Para gerar e testar a versão de produção:

```bash
npm run build
npm run preview
```

O resultado da build fica em `dist/`. O plugin local do Vite copia `imagens/` para `dist/imagens/`, pois templates criam dinamicamente os caminhos das imagens durante a execução. Use HTTP local em vez de abrir o HTML por `file://`.

## Dados no navegador

`salvarPreferencia` converte valores com `JSON.stringify()` e grava com `localStorage.setItem()`. `lerPreferencia` usa `getItem()` e `JSON.parse()`, devolvendo o padrão quando a chave não existe ou ocorre erro. `removerPreferencia` exclui apenas a chave solicitada.

| Chave efetivamente usada | Conteúdo |
| --- | --- |
| `esporte-que-transforma:projetos-favoritos` | Lista dos identificadores dos projetos |
| `esporte-que-transforma:ultima-rota` | Identificador da última rota visitada |
| `esporte-que-transforma:rascunho-mensagem-voluntario` | Texto livre digitado no campo de mensagem do formulário de voluntariado |

Os favoritos usam os dados originais de `templates.js` para títulos, imagens e descrições. Na inicialização, somente um array de IDs existentes é aceito; duplicados, tipos inválidos e IDs desconhecidos são descartados. JSON corrompido, localStorage bloqueado e falhas de leitura ou gravação resultam em uma lista vazia ou em estado mantido apenas na memória durante a visita. Nesse caso, a interface continua permitindo salvar, remover, filtrar e limpar, mas o aviso informa que a alteração não será mantida para a próxima visita. O botão “Limpar favoritos” remove somente a seleção de projetos.

O texto livre do rascunho pode conter informações pessoais inseridas pelo usuário. Use dados fictícios na demonstração. A persistência desse campo precisa ser revista antes de uso real. Não há backend para receber os cadastros.

## Versionamento e GitFlow

O histórico começa com o estado recebido nesta etapa, sem reconstruir artificialmente commits anteriores.

- `main`: referência principal do projeto; receberá versões aprovadas para publicação. O registro inicial não equivale a uma certificação de produção.
- `develop`: base de integração das próximas alterações.
- `feature/<nome>`: criada a partir de `develop` para uma funcionalidade ou melhoria concreta e integrada de volta por pull request.
- `release/<versao>`: quando houver um lançamento, criada a partir de `develop`; após validação, integrada à `main` e à `develop`, com tag de versão.
- `hotfix/<nome>`: criada a partir de `main` quando surgir uma correção urgente; integrada à `main` e à `develop`.

Branches temporárias são criadas quando houver trabalho correspondente. Não há simulação de colaboradores, revisões ou lançamentos.

Exemplo para iniciar uma melhoria futura:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/acessibilidade
# Implementar e verificar as alterações antes de adicioná-las ao commit.
git status
git add caminho/do/arquivo
git commit -m "fix: corrige foco do menu"
git push -u origin feature/acessibilidade
```

Abra um pull request com destino a `develop`, descrevendo a mudança e as verificações realizadas. Use mensagens semânticas como `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:` e `chore:`, conforme a alteração efetiva.

## Verificações e pendências

Em uma preparação anterior, foram registradas a verificação da sintaxe dos nove arquivos JavaScript com `node --check` e a existência dos recursos locais diretamente referenciados por `src` e `href` no `index.html`.

Não foi realizado teste com leitor de tela nem auditoria manual completa da WCAG. Os resultados abaixo se limitam às verificações realmente feitas nesta etapa e não representam certificação de conformidade.

### Auditoria de acessibilidade (2026-09-27)

Problemas encontrados e corrigidos:

- Ao remover o último favorito com o filtro ativo, o foco permanecia dentro do cartão oculto. Agora volta ao controle do filtro; ao limpar favoritos, o foco também sai do botão que será ocultado.
- A cópia do Pix desabilitava o botão focado e o fallback criava um textarea invisível que recebia foco. O controle agora permanece focável durante a prevenção de cliques repetidos e o fallback usa a chave visível; o toast devolve o foco à origem ao ser fechado ou expirar.
- O título da rota recebia foco sem indicador visível. Foi adicionado um contorno de foco com contraste sobre fundos claros e escuros.
- Os indicadores do carrossel declaravam abas sem implementar o padrão de teclado de abas. Agora são botões de alternância nativos, agrupados e com estado `aria-pressed`; o carrossel e seus controles têm nomes/regiões acessíveis. A rotação pode ser pausada e respeita movimento reduzido.
- O botão do submenu mantinha o nome “Abrir projetos” quando aberto. O nome agora acompanha o estado e Escape fecha o submenu e o menu móvel na ordem esperada.
- Texto branco sobre o teal `#1d9b8f` tinha contraste de 3,42:1. Botões textuais usam o teal escuro existente `#14766e` (5,46:1); o hover do botão contornado de doação também passou a ter fundo escuro.
- Os grids do hero e dos materiais de doação mantinham 12 colunas no mobile e causavam rolagem horizontal. Foram empilhados abaixo do breakpoint desktop; o texto do hero também foi afastado dos controles do carrossel.
- A região ao vivo do toast incluía seus botões; o anúncio foi limitado à mensagem. Erros de campo mantêm eventuais descrições auxiliares junto da mensagem associada.

Testes executados via navegador integrado, com o site servido por `System.Net.HttpListener` do PowerShell em `http://localhost:8765/`:

- Nas dez rotas: idioma `pt-BR`, um `h1`, hierarquia sem saltos de nível, uma região `main`, links nomeados, imagens com atributo `alt` e campos rotulados.
- Navegação SPA com Enter, foco no novo título e uso de Voltar/Avançar; menu por Enter/Espaço/Escape; skip link até `main`.
- Favoritar, filtrar, desfavoritar e limpar com teclado, conferindo o estado salvo, os cartões ocultos e o destino do foco.
- Formulários de voluntário e participante: envio inválido com foco/descrição do primeiro erro e envio válido com mensagem de sucesso.
- Pix por teclado com Clipboard disponível e com falha simulada de Clipboard/`execCommand`; seleção manual da chave e fechamento do toast sem perda de foco.
- Carrossel por teclado: avançar, pausar, retomar e estado com `prefers-reduced-motion` ativo.
- Reflow nas dez rotas a 641 CSS px (largura equivalente aproximada a 200% de zoom em uma viewport de 1280 CSS px), sem rolagem horizontal. Doação e hero também foram medidos a 480 CSS px; não houve overflow nem sobreposição entre texto e controles do hero.
- Contrastes calculados pela luminância relativa WCAG: texto/fundo geral 12,22:1; texto suave/fundo 5,95:1; branco/cabeçalho 11,61:1; texto de botão/teal escuro 5,46:1; badges 4,76:1 a 5,12:1; alertas 7,00:1 a 8,37:1; foco amarelo/cabeçalho 6,56:1; texto do rodapé/fundo 12,15:1.
- Diagnósticos do editor: nenhum erro nos módulos JavaScript alterados. O `git diff --check` literal sinalizou os CR finais do arquivo preexistente `css/componentes.css`, armazenado em CRLF; com `core.whitespace=cr-at-eol`, passou sem outros apontamentos.

Limitações desta verificação:

- Não houve teste com leitor de tela. Axe, Lighthouse e pa11y não estavam disponíveis no ambiente; a árvore de acessibilidade do navegador foi inspecionada, mas não equivale a uma auditoria automática WCAG.
- O navegador integrado limitou a viewport solicitada de 320 a 480 CSS px. Portanto, 320 CSS px exatos não foram verificados. A largura de 641 CSS px foi usada como aproximação de reflow para 200%; o zoom do navegador não foi alterado diretamente.
- Não foi feita medição automatizada, pixel a pixel, do texto sobre todas as fotografias e estados de gradiente. A identidade visual e a sobreposição do hero foram conferidas visualmente/por geometria no navegador.
- Os resultados parciais não declaram conformidade integral com WCAG 2.1 A/AA. Recomenda-se completar as verificações com leitor de tela e viewport real de 320 CSS px.

Mudanças e verificações desta correção de favoritos:

- A lista recuperada é validada contra os três IDs definidos em `templates.js`, com remoção de duplicados e descarte de valores inválidos.
- Falhas de JSON e de acesso ao localStorage não interrompem a aplicação; alterações posteriores ficam em memória durante a visita quando necessário.
- Foram verificados no navegador integrado via `http://localhost:8765/`: operação inválida com ID desconhecido sem alteração de estado e sem feedback de sucesso ou persistência; salvar e remover com persistência; filtrar e limpar; atualização de texto, `aria-pressed`, filtro e mensagem vazia; e restauração de um favorito após recarregar com armazenamento disponível.
- Naquela etapa, o servidor HTTP foi executado com `System.Net.HttpListener` em um job do PowerShell porque Node e Python não estavam disponíveis no PATH. A integração Vite abaixo usou Node portátil temporário e npm.
- A sintaxe foi verificada pelo diagnóstico do editor, sem erros nos arquivos alterados naquela etapa; não foi possível executar `node --check` naquele ambiente.

### Integração Vite (2026-09-27)

- Branch de trabalho: `feature/vite-build`; sem merge automático para `develop`.
- `npm.cmd install --no-audit --no-fund --progress=false`: dependências instaladas/atualizadas; Vite 6.4.3 resolvido no lockfile.
- `npm.cmd run dev -- --host 127.0.0.1 --port 5173`: servidor iniciado; navegador confirmou carregamento dos módulos, navegação SPA, foco no título e favorito persistido.
- `npm.cmd run build`: build concluída com sucesso; Vite gerou `dist/index.html`, CSS e JavaScript minificados. A configuração copiou `imagens/` para `dist/imagens/`.
- `npm.cmd run preview -- --host 127.0.0.1 --port 4173`: preview iniciado; navegador confirmou imagem do hero carregada a partir de `dist`, pausa do carrossel, favorito em localStorage e primeiro erro de formulário associado/focado.
- O Node.js LTS v22.23.3 foi baixado como distribuição portátil para `%TEMP%`, pois Node/npm não estavam instalados no PATH; `npm.cmd` foi usado devido à política PowerShell que bloqueia `npm.ps1`. `dist/` e `node_modules/` são ignorados pelo Git.
- `git diff --check` passou com `core.whitespace=cr-at-eol` para preservar o CRLF preexistente em `css/componentes.css`.

Pendências que permanecem fora desta correção:

- Rever a persistência do texto livre de voluntariado.
- Completar a verificação com leitor de tela, zoom real de 200% e viewport exata de 320 CSS px; ainda não se declara conformidade integral.
- Medir performance e preparar otimizações e publicação de produção.

## Publicação

O projeto pode ser servido como arquivos estáticos a partir de `dist/`, gerado por `npm run build`. As rotas da SPA usam hash; `npm run preview` serve localmente a build para conferência antes de publicação.

A criação deste repositório não configura automaticamente deploy ou GitHub Pages. O endereço e as instruções do ambiente definitivo devem ser registrados após sua configuração e verificação.

## Autoria e licença

Lucas Cusato de Paula — projeto acadêmico Esporte que Transforma.

Não foi adicionada uma licença de redistribuição. A publicação do repositório não atribui automaticamente licença livre ao código ou às imagens.
