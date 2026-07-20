// ======================================
// ABAS.JS
// Gerencia as abas do contrato
// ======================================

const Abas = {

    // ======================================
    // Renderiza todas as abas
    // ======================================
    async render(abas) {

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

        container.innerHTML = "";

        for (const aba of abas) {
            const botao = await this.criarBotao(aba);
            container.appendChild(botao);
        }

    },

    // ======================================
    // Cria um botão de aba
    // ======================================
    async criarBotao(aba) {

        const botao = document.createElement("button");

        botao.className = "tab-btn";
        botao.dataset.id = aba.id;

        let svg = "";

        try {

            const resposta = await fetch(aba.icone);

            if (!resposta.ok) {
                throw new Error("SVG não encontrado.");
            }

            svg = await resposta.text();

        } catch (erro) {

            console.error(`Erro ao carregar ícone: ${aba.icone}`, erro);

        }

        botao.innerHTML = `
            <span class="tab-icon">
                ${svg}
            </span>

            <span class="tab-text">
                ${aba.nome}
            </span>
        `;

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