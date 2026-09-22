/* =========================================================
   ARMAZENAMENTO — leitura e gravação no localStorage
   Guarda somente dados fictícios e não sensíveis (preferência de
   visualização, última rota acessada, rascunho de um campo de
   texto livre). Nunca CPF, telefone, endereço ou data de nascimento.
   ========================================================= */
window.ONG = window.ONG || {};

window.ONG.armazenamento = (function () {
    "use strict";

    /* Prefixo próprio para não colidir com outras chaves do navegador. */
    const PREFIXO = "esporte-que-transforma:";

    function disponivel() {
        try {
            const chaveTeste = PREFIXO + "__teste__";
            localStorage.setItem(chaveTeste, "1");
            localStorage.removeItem(chaveTeste);
            return true;
        } catch (erro) {
            /* Modo privado, cota excedida ou localStorage bloqueado:
               a aplicação continua funcionando, só sem persistir. */
            return false;
        }
    }

    /* Devolve true/false para quem precisar saber se a gravação
       realmente aconteceu (ex.: só confirmar ao usuário depois de
       persistir de verdade). Falha de forma silenciosa mesmo assim:
       preferências não são essenciais ao uso do site. */
    function salvarPreferencia(chave, valor) {
        if (!disponivel()) return false;
        try {
            localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
            return true;
        } catch (erro) {
            return false;
        }
    }

    function lerPreferencia(chave, valorPadrao) {
        if (!disponivel()) return valorPadrao;
        try {
            const bruto = localStorage.getItem(PREFIXO + chave);
            if (bruto === null) return valorPadrao;
            return JSON.parse(bruto);
        } catch (erro) {
            /* Valor corrompido ou inválido: ignora e usa o padrão. */
            return valorPadrao;
        }
    }

    function removerPreferencia(chave) {
        if (!disponivel()) return false;
        try {
            localStorage.removeItem(PREFIXO + chave);
            return true;
        } catch (erro) {
            return false;
        }
    }

    return { salvarPreferencia, lerPreferencia, removerPreferencia };
})();
