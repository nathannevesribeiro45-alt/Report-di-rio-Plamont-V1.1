// ======================================
// ATIVIDADES.JS
// Responsável por renderizar as
// atividades da aba atual
// ======================================

const Atividades = {

    // ======================================
    // Renderiza a seção
    // ======================================
    render(aba, container) {

        if (!aba || !aba.atividades) return;
        if (!container) return;

        const secao = this.criarSecao();

        const listaContainer = secao.querySelector(".atividades-lista");

        this.criarLista(
            aba.atividades,
            listaContainer
        );

        if (aba.observacoes && aba.observacoes.length > 0) {

            secao.appendChild(
                this.criarObservacoes(aba.observacoes)
            );

        }

        container.appendChild(secao);

    },

    // ======================================
    // Cria a seção
    // ======================================
    criarSecao() {

        const secao = document.createElement("section");

        secao.className = "bloco atividades";

        secao.innerHTML = `
            <h2>📋 OMs do Dia</h2>

            <div class="atividades-lista"></div>
        `;

        return secao;

    },

    // ======================================
    // Cria todos os cards dos líderes
    // ======================================
    criarLista(atividades, container) {

        if (!atividades.length) {

            container.innerHTML = `
                <div class="lista-vazia">
                    <div class="lista-vazia-icone"></div>
                    <h3>✅Nenhuma atividade cadastrada</h3>
                    <p>Não há atividades programadas para este turno.</p>
                </div>
            `;

            return;

        }

        atividades.forEach(lider => {

            container.appendChild(
                this.criarCardLider(lider)
            );

        });

    },

    // ======================================
    // Cria o card do líder
    // ======================================
    criarCardLider(lider) {

        const card = document.createElement("div");

        card.className = "atividade-card";

        card.appendChild(
            this.criarCabecalho(lider)
        );

        card.appendChild(
            this.criarListaOMs(lider.oms)
        );

        return card;

    },

    // ======================================
    // Cabeçalho
    // ======================================
    criarCabecalho(lider) {

        const cabecalho = document.createElement("div");

        cabecalho.className = "atividade-cabecalho";

        cabecalho.innerHTML = `

            <div class="atividade-lider">

                <h3>👷 ${lider.lider}</h3>

                <span class="atividade-total">
                    ${(lider.oms || []).length} OMs
                </span>

            </div>

            <p class="atividade-telefone">
    📞 ${lider.telefone || "--"}
</p>

${lider.tecnicoSeguranca ? `
    <p class="atividade-tecnico">
        🦺 ${lider.tecnicoSeguranca}
    </p>
` : ""}

<p class="atividade-equipe">
    👥 ${lider.equipe || "--"}
</p>

        `;

        return cabecalho;

    },

    // ======================================
    // Lista de OMs
    // ======================================
    criarListaOMs(oms) {

        const lista = document.createElement("div");

        lista.className = "atividade-oms";

        if (!oms || oms.length === 0) {

            lista.innerHTML = `
                <p>Nenhuma atividade cadastrada.</p>
            `;

            return lista;

        }

        oms.forEach(om => {

            lista.appendChild(
                this.criarOM(om)
            );

        });

        return lista;

    },

    // ======================================
    // Card da OM
    // ======================================
    criarOM(om) {

        const card = document.createElement("div");

        card.className = "atividade-om";

        card.innerHTML = `

            <div class="om-topo">

                <div class="om-numero">

                    📋 OM ${om.numero || "--"}

                </div>

                ${om.status ? `
                    <div class="om-status">
                        ${om.status}
                    </div>
                ` : ""}

            </div>

            <div class="om-descricao">

                ${om.descricao || "--"}

            </div>

        `;

        return card;

    },

    // ======================================
    // Observações
    // ======================================
    criarObservacoes(observacoes) {

        const bloco = document.createElement("div");

        bloco.className = "atividade-observacoes";

        bloco.innerHTML = `
            <h3>📝 Observações Gerais</h3>
        `;

        const lista = document.createElement("ul");

        observacoes.forEach(obs => {

            const item = document.createElement("li");

            item.textContent = obs;

            lista.appendChild(item);

        });

        bloco.appendChild(lista);

        return bloco;

    }

};