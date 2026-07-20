// ======================================
// ABAS.JS
// Gerencia as abas do contrato
// ======================================

const Abas = {

    // ======================================
    // Renderiza todas as abas
    // ======================================
    render(abas) {

        if (!abas || abas.length === 0) {
            console.warn("Nenhuma aba encontrada.");
            return;
        }

        const container = document.getElementById(
            `${Dashboard.contratoAtual.id}-tabs`
        );

        if (!container) {
            console.warn("Container das abas não encontrado.");
            return;
        }

        // Limpa o container
        container.innerHTML = "";

        // Cria as abas
        abas.forEach(aba => {
            container.appendChild(
                this.criarBotao(aba)
            );
        });

    },

    // ======================================
    // Cria um botão de aba
    // ======================================
    criarBotao(aba) {

        const botao = document.createElement("button");

        botao.className = "tab-btn";
        botao.dataset.id = aba.id;
        botao.textContent = aba.nome;

        botao.addEventListener("click", () => {
            Render.selecionarAba(aba.id);
        });

        return botao;

    },

    // ======================================
    // Atualiza a aba ativa
    // ======================================
    atualizarAtiva(idAba) {

        const botoes = document.querySelectorAll(
            `#${Dashboard.contratoAtual.id}-tabs .tab-btn`
        );

        botoes.forEach(botao => {

            botao.classList.toggle(
                "ativa",
                botao.dataset.id === idAba
            );

        });

    }

};