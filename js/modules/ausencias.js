// ======================================
// AUSENCIAS.JS
// Responsável por renderizar as ausências
// da aba atual
// ======================================

const Ausencias = {

    // ======================================
    // Renderiza a seção
    // ======================================
    render(aba, container) {

        if (!aba?.ausencias) return;
        if (!container) return;

        const secao = this.criarSecao();

        const listaContainer =
            secao.querySelector(".lista-card");

        const total = this.calcularTotal(
    aba.ausencias
);

if (total === 0) {

    listaContainer.innerHTML = `
        <div class="lista-vazia">
            <div class="lista-vazia-icone"></div>
            <h3>✅Nenhuma ausência registrada</h3>
            <p>Todos os colaboradores compareceram ao trabalho neste turno.</p>
        </div>
    `;

} else {

    this.criarLista(
        aba.ausencias,
        listaContainer
    );

}

        const rodape = document.createElement("div");

        rodape.className = "lista-total";

        rodape.innerHTML = `
            <span>📋 Justificadas: <strong>${aba.ausencias.justificadas}</strong></span>

            <span>❌ Não Justificadas: <strong>${aba.ausencias.naoJustificadas}</strong></span>

            <span>👥 Total: <strong>${total}</strong></span>
        `;

        secao.appendChild(rodape);

        container.appendChild(secao);

    },

    // ======================================
    // Cria a seção
    // ======================================
    criarSecao() {

        const secao = document.createElement("section");

        secao.className = "bloco";

        secao.innerHTML = `
            <h2>🚫 Ausências</h2>

            <p class="lista-subtitulo">
                Controle diário do efetivo
            </p>

            <div class="lista-card"></div>
        `;

        return secao;

    },

    // ======================================
    // Cria a lista
    // ======================================
    criarLista(ausencias, container) {

        Object.entries(ausencias).forEach(([funcao, quantidade]) => {

            if (
                funcao === "justificadas" ||
                funcao === "naoJustificadas"
            ) return;

            const item = document.createElement("div");

            item.className = "lista-item";

            item.innerHTML = `
                <span class="lista-label">${funcao}</span>

                <span class="lista-valor">${quantidade}</span>
            `;

            container.appendChild(item);

        });

    },

    // ======================================
    // Calcula o total de ausências
    // ======================================
    calcularTotal(ausencias) {

        let total = 0;

        Object.entries(ausencias).forEach(([funcao, quantidade]) => {

            if (
                funcao === "justificadas" ||
                funcao === "naoJustificadas"
            ) return;

            total += Number(quantidade) || 0;

        });

        return total;

    }

};