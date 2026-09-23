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

HTML5, CSS3 e JavaScript, sem framework e sem dependências NPM. A aplicação principal não importa bibliotecas externas por CDN. Os módulos usam funções encapsuladas e o namespace `window.ONG`; não utilizam `import`/`export`.

Os scripts são carregados com `defer`, na ordem definida no `index.html`. O módulo `app.js` reúne as rotas e inicializa navegação, formulários e componentes. A URL utiliza fragmentos, como `index.html#projetos`, com integração ao histórico do navegador.

| Caminho | Responsabilidade |
| --- | --- |
| `index.html` | Entrada da SPA, cabeçalho, navegação, rodapé e região de notificações |
| `css/` | Estilos gerais, componentes e páginas |
| `js/app.js` | Inicialização e registro de rotas |
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

1. Instale o Git e clone o repositório:

```bash
git clone https://github.com/lucascusato21/esporte-que-transforma.git
cd esporte-que-transforma
```

2. Abra a pasta no VSCode e sirva o `index.html` com uma extensão de servidor local. Como alternativa, com Python 3 instalado, execute na raiz:

```bash
python -m http.server 8000
```

3. Acesse `http://localhost:8000` no navegador. Encerre o servidor com `Ctrl+C`.

Não há instalação NPM nem etapa de build nesta versão. Prefira HTTP local ao duplo clique: o comportamento do armazenamento e de APIs do navegador pode variar em URLs `file://`.

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

Ainda não foram executados testes com leitor de tela, responsividade ou auditoria completa WCAG. As capturas preexistentes não substituem essa validação.

Mudanças e verificações desta correção de favoritos:

- A lista recuperada é validada contra os três IDs definidos em `templates.js`, com remoção de duplicados e descarte de valores inválidos.
- Falhas de JSON e de acesso ao localStorage não interrompem a aplicação; alterações posteriores ficam em memória durante a visita quando necessário.
- Foram verificados no navegador integrado via `http://localhost:8765/`: operação inválida com ID desconhecido sem alteração de estado e sem feedback de sucesso ou persistência; salvar e remover com persistência; filtrar e limpar; atualização de texto, `aria-pressed`, filtro e mensagem vazia; e restauração de um favorito após recarregar com armazenamento disponível.
- O servidor HTTP foi executado com `System.Net.HttpListener` em um job do PowerShell, pois `node` e `python` não estão disponíveis neste ambiente.
- A sintaxe foi verificada pelo diagnóstico do editor, sem erros nos arquivos alterados. Não foi possível executar `node --check` nem iniciar `python -m http.server`, pois `node` e `python` não estão disponíveis neste ambiente.

Pendências que permanecem fora desta correção:

- Rever a persistência do texto livre de voluntariado.
- Realizar testes manuais e automatizados de acessibilidade aplicáveis à WCAG 2.1 AA, incluindo teclado, foco, contraste, zoom e mensagens de erro. Ainda não se declara conformidade.
- Medir performance e preparar otimizações e publicação de produção.

## Publicação

O projeto pode ser servido como arquivos estáticos, com a raiz contendo `index.html`, `css/`, `js/` e `imagens/`. As rotas da SPA usam hash. Não há comando de build configurado.

A criação deste repositório não configura automaticamente deploy ou GitHub Pages. O endereço e as instruções do ambiente definitivo devem ser registrados após sua configuração e verificação.

## Autoria e licença

Lucas Cusato de Paula — projeto acadêmico Esporte que Transforma.

Não foi adicionada uma licença de redistribuição. A publicação do repositório não atribui automaticamente licença livre ao código ou às imagens.
