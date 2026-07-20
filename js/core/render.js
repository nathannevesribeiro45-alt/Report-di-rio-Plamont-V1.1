// ==========================================
// RENDER.JS
// Orquestrador da interface
// ==========================================

const Render = {

    // ==========================================
    // Inicializa o contrato
    // ==========================================
    async inicializar() {

        if (!Dashboard.contratoAtual) {
            console.error("Nenhum contrato carregado.");
            return;
        }

        // Cabeçalho
        Header.render(Dashboard.contratoAtual);

        // Abas
        await Abas.render(Dashboard.contratoAtual.abas);

        // Primeira aba
        const primeiraAba = Dashboard.contratoAtual.abas[0];

        if (primeiraAba) {
            this.selecionarAba(primeiraAba.id);
        }

    },

    // ==========================================
    // Troca de aba
    // ==========================================
    selecionarAba(idAba) {

        Dashboard.abaAtual = Dashboard.contratoAtual.abas.find(
            aba => aba.id === idAba
        );

        if (!Dashboard.abaAtual) {
            console.warn("Aba não encontrada.");
            return;
        }

        Abas.atualizarAtiva(idAba);

        this.conteudo();

    },

    // ==========================================
    // Renderiza conteúdo da aba
    // ==========================================
    conteudo() {

        const container = document.getElementById(
            `${Dashboard.contratoAtual.id}-content`
        );

        if (!container) {
            console.error("Container de conteúdo não encontrado.");
            return;
        }

        container.innerHTML = "";

        QLP.render(Dashboard.abaAtual, container);
        Histograma.render(Dashboard.abaAtual, container);
        Ausencias.render(Dashboard.abaAtual, container);
        Mobilizacao.render(Dashboard.abaAtual, container);
        Recursos.render(Dashboard.abaAtual, container);
        Atividades.render(Dashboard.abaAtual, container);

    },

    // ==========================================
    // Atualiza somente o conteúdo
    // ==========================================
    atualizar() {

        this.conteudo();

    }

};