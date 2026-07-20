// ======================================
// RECURSOS.JS
// Responsável por renderizar os recursos
// disponíveis da aba atual
// ======================================

const Recursos = {

    // ======================================
    // Renderiza a seção
    // ======================================
    render(aba, container) {

        if (!aba || !aba.recursos) return;
        if (!container) return;

        const secao = this.criarSecao();

        const lista = secao.querySelector(".recursos-grid");

        this.criarLista(
            aba.recursos,
            lista
        );

        container.appendChild(secao);

    },

    // ======================================
    // Cria a seção
    // ======================================
    criarSecao() {

        const secao = document.createElement("section");

        secao.className = "bloco recursos";

        secao.innerHTML = `
            <h2>🚚 Recursos Disponíveis</h2>

            <div class="recursos-grid"></div>
        `;

        return secao;

    },

// ======================================
// Cria a lista
// ======================================
criarLista(recursos, container) {

    if (!recursos.length) {

        container.innerHTML = `
            <div class="lista-vazia">
                <div class="lista-vazia-icone"></div>
                <h3>✅Nenhum recurso informado</h3>
                <p>Não há equipamentos cadastrados para este turno.</p>
            </div>
        `;

        return;

    }

    const grupos = {};

    recursos.forEach(recurso => {

        if (!recurso.tipo) return;

        if (!grupos[recurso.tipo]) {

            grupos[recurso.tipo] = [];

        }

        grupos[recurso.tipo].push(recurso);

    });

    Object.keys(grupos).forEach(tipo => {

        container.appendChild(

            this.criarItem(
                tipo,
                grupos[tipo]
            )

        );

    });

},

// ======================================
// Cria um card de recurso
// ======================================
criarItem(tipo, recursos) {

    const item = document.createElement("div");

    item.className = "recurso-card";

    let linhas = "";

    recursos.forEach(recurso => {

        linhas += `

            <div class="recurso-linha">

                <span class="recurso-placa">
                    🚘 ${recurso.placa || "--"}
                </span>

                <span class="recurso-operador">
                    👷 ${recurso.operador || "--"}
                </span>

            </div>

        `;

    });

    item.innerHTML = `

        <div class="recurso-header">

            <span class="recurso-icone">

                ${this.icone(tipo)}

            </span>

            <span class="recurso-titulo">

                ${tipo}

            </span>

        </div>

        <div class="recurso-info">

            ${linhas}

        </div>

    `;

    return item;

},
    // ======================================
    // Retorna o ícone
    // ======================================
    icone(tipo) {

        switch (tipo.toLowerCase()) {

            case "munck":
                return "🚛";

            case "pick-up":
                return "🚗";

            case "veículo leve":
                return "🚗";

            case "caminhão comboio":
                return "⛽";

            case "guindaste":
                return "🏗️";

            case "compressor":
                return "🛠️";

            case "torre de iluminação":
                return "💡";

            default:
                return "📦";

        }

    }

};