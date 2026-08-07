// ======================================
// MAPA.JS
// ======================================

const Mapa = {

    contratoAtivo: null,
    tabsRenderizadas: false,

    // Instância do Leaflet e camadas
    map: null,
    tileSatelite: null,
    tileRuas: null,
    camadaAtual: "satelite",
    markersLayer: null,

    // Estado da UI
    marcadorSelecionado: null,
    filtrosAtivos: new Set(["concluida", "andamento", "atrasada", "planejada"]),

    // Ponto central de referência (Porto do Itaqui — São Luís/MA)
    // Usado apenas para posicionar os pinos fictícios (ver aviso acima)
    centroReferencia: { lat: -2.5716, lng: -44.3696 },

    statusConfig: {
        concluida: { label: "Concluída", classe: "status-concluida" },
        andamento: { label: "Em andamento", classe: "status-andamento" },
        atrasada: { label: "Atrasada", classe: "status-atrasada" },
        planejada: { label: "Planejada", classe: "status-planejada" }
    },

    // ======================================
    // Ponto de entrada — chamado ao abrir
    // a página pela sidebar
    // ======================================
    render() {

        const tabsContainer = document.getElementById("mapa-tabs");
        const area = document.getElementById("mapa-area");
        const vazio = document.getElementById("mapa-vazio");

        if (!tabsContainer || !area) {
            console.error("Estrutura da página Mapa não encontrada.");
            return;
        }

        if (!Dashboard || !Dashboard.contratos || !Object.keys(Dashboard.contratos).length) {

            if (vazio) vazio.style.display = "flex";
            return;

        }

        if (vazio) vazio.style.display = "none";

        // Define contrato inicial (primeiro disponível)
        if (!this.contratoAtivo) {

            const primeiro = Object.values(Dashboard.contratos)[0];
            this.contratoAtivo = primeiro ? primeiro.id : null;

        }

        if (!this.tabsRenderizadas) {

            this.renderTabs(tabsContainer);
            this.tabsRenderizadas = true;

        }

        this.atualizarTabAtiva(tabsContainer);

        this.iniciarMapa();
        this.renderFrentes();

        // Garante que o Leaflet recalcule o tamanho do container
        // (a página pode ter estado com display:none até agora)
        setTimeout(() => {
            if (this.map) this.map.invalidateSize();
        }, 150);

    },

    // ======================================
    // Cria as abas de contrato (topo da página)
    // ======================================
    renderTabs(container) {

        container.innerHTML = "";

        const slider = document.createElement("div");
        slider.className = "tab-slider";
        container.appendChild(slider);

        Object.values(Dashboard.contratos).forEach(contrato => {

            const botao = document.createElement("button");

            botao.className = "tab-btn";
            botao.dataset.id = contrato.id;

            botao.innerHTML = `
                <span class="tab-text">
                    ${contrato.nome.replace("Contrato ", "")}
                </span>
            `;

            botao.addEventListener("click", () => {

                this.contratoAtivo = contrato.id;
                this.fecharPainel();

                this.atualizarTabAtiva(container);
                this.renderFrentes();

            });

            container.appendChild(botao);

        });

    },

    // ======================================
    // Marca a aba ativa e move o slider
    // ======================================
    atualizarTabAtiva(container) {

        const slider = container.querySelector(".tab-slider");
        const botoes = container.querySelectorAll(".tab-btn");

        botoes.forEach(botao => {

            const ativa = botao.dataset.id === this.contratoAtivo;

            botao.classList.toggle("ativa", ativa);

            if (ativa && slider) {

                slider.style.width = `${botao.offsetWidth}px`;
                slider.style.height = `${botao.offsetHeight}px`;
                slider.style.left = `${botao.offsetLeft}px`;
                slider.style.top = `${botao.offsetTop}px`;

            }

        });

    },

    // ======================================
    // Inicializa o mapa Leaflet (uma única vez)
    // e os controles customizados
    // ======================================
    iniciarMapa() {

        if (this.map) return;

        const canvas = document.getElementById("mapa-canvas");
        if (!canvas) return;

        this.map = L.map(canvas, {
            zoomControl: false,
            attributionControl: true
        }).setView([this.centroReferencia.lat, this.centroReferencia.lng], 15);

        // Camada satélite (visão aérea — padrão)
        this.tileSatelite = L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
                maxZoom: 19,
                attribution: "Tiles &copy; Esri"
            }
        ).addTo(this.map);

        // Camada de ruas (alternativa via botão de camadas)
        this.tileRuas = L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution: "&copy; OpenStreetMap"
            }
        );

        this.markersLayer = L.layerGroup().addTo(this.map);

        this.iniciarControles();
        this.iniciarLegenda();
        this.iniciarPainel();

    },

    // ======================================
    // Botões customizados: zoom, localizar, camadas
    // ======================================
    iniciarControles() {

        const controles = document.getElementById("mapa-controles");
        if (!controles) return;

        controles.querySelector('[data-acao="zoom-in"]')
            ?.addEventListener("click", () => this.map.zoomIn());

        controles.querySelector('[data-acao="zoom-out"]')
            ?.addEventListener("click", () => this.map.zoomOut());

        controles.querySelector('[data-acao="localizar"]')
            ?.addEventListener("click", () => {
                this.map.setView([this.centroReferencia.lat, this.centroReferencia.lng], 15);
            });

        controles.querySelector('[data-acao="camadas"]')
            ?.addEventListener("click", () => this.alternarCamada());

    },

    // ======================================
    // Alterna entre satélite e ruas
    // ======================================
    alternarCamada() {

        if (this.camadaAtual === "satelite") {

            this.map.removeLayer(this.tileSatelite);
            this.map.addLayer(this.tileRuas);
            this.camadaAtual = "ruas";

        } else {

            this.map.removeLayer(this.tileRuas);
            this.map.addLayer(this.tileSatelite);
            this.camadaAtual = "satelite";

        }

    },

    // ======================================
    // Painel lateral: liga o botão de fechar
    // ======================================
    iniciarPainel() {

        document.getElementById("mapa-painel-fechar")
            ?.addEventListener("click", () => this.fecharPainel());

    },

    // ======================================
    // Legenda: cria os itens de status (uma vez)
    // e liga o filtro de visibilidade
    // ======================================
    iniciarLegenda() {

        const legenda = document.getElementById("mapa-legenda");
        if (!legenda || legenda.dataset.pronta) return;

        legenda.innerHTML = "";

        Object.entries(this.statusConfig).forEach(([chave, cfg]) => {

            const item = document.createElement("button");

            item.type = "button";
            item.className = "mapa-legenda-item";
            item.dataset.status = chave;

            item.innerHTML = `
                <span class="mapa-legenda-dot ${cfg.classe}"></span>
                <span class="mapa-legenda-texto">${cfg.label}</span>
                <span class="mapa-legenda-contagem">(0)</span>
            `;

            item.addEventListener("click", () => {

                if (this.filtrosAtivos.has(chave)) {
                    this.filtrosAtivos.delete(chave);
                } else {
                    this.filtrosAtivos.add(chave);
                }

                item.classList.toggle("inativo", !this.filtrosAtivos.has(chave));

                this.renderFrentes(false);

            });

            legenda.appendChild(item);

        });

        legenda.dataset.pronta = "1";

    },

    // ======================================
    // Atualiza a contagem de cada item da legenda
    // ======================================
    atualizarLegenda(marcadores) {

        const legenda = document.getElementById("mapa-legenda");
        if (!legenda) return;

        const contagens = { concluida: 0, andamento: 0, atrasada: 0, planejada: 0 };

        marcadores.forEach(m => contagens[m.status]++);

        Object.entries(contagens).forEach(([chave, total]) => {

            const item = legenda.querySelector(`[data-status="${chave}"] .mapa-legenda-contagem`);
            if (item) item.textContent = `(${total})`;

        });

    },

    // ======================================
    // Monta as frentes (pinos) do contrato ativo
    // ======================================
    renderFrentes(recentralizar = true) {

        const contrato = Dashboard.contratos[this.contratoAtivo];

        this.markersLayer.clearLayers();
        this.fecharPainel();

        if (!contrato) return;

        const marcadores = this.montarMarcadores(contrato);

        this.atualizarLegenda(marcadores);

        const pontos = [];

        marcadores.forEach(dado => {

            if (!this.filtrosAtivos.has(dado.status)) return;

            const marker = L.marker([dado.lat, dado.lng], {
                icon: this.criarIcone(dado)
            });

            marker.on("click", () => this.abrirPainel(dado, marker));

            marker.addTo(this.markersLayer);
            pontos.push([dado.lat, dado.lng]);

        });

        if (recentralizar && pontos.length) {

            this.map.fitBounds(pontos, { padding: [60, 60], maxZoom: 16 });

        }

    },

    // ======================================
    // Constrói a lista de marcadores a partir dos
    // dados de contrato/frente/líder
    // ======================================
    montarMarcadores(contrato) {

        const marcadores = [];

        (contrato.abas || []).forEach(aba => {

            const lideres = aba.atividades || [];

            if (lideres.length) {

                lideres.forEach((lider, indice) => {
                    marcadores.push(this.criarDadosMarcador(contrato, aba, lider, indice));
                });

            } else {

                // Frente ainda sem equipe/atividade lançada no dia —
                // exibimos mesmo assim, como "Planejada", para não
                // sumir do mapa (bom para acompanhamento futuro).
                marcadores.push(this.criarDadosMarcador(contrato, aba, null, 0));

            }

        });

        return marcadores;

    },

    // ======================================
    // Normaliza os dados de uma frente/líder
    // em um objeto pronto para virar pino
    // ======================================
    criarDadosMarcador(contrato, aba, lider, indice) {

        const seed = `${contrato.id}-${aba.id}-${lider?.lider || "frente"}-${indice}`;
        const coordenada = this.obterCoordenada(seed, aba, lider);

        return {

    id: seed,

    lat: coordenada.lat,
    lng: coordenada.lng,

    status: this.calcularStatus(lider),

    // Contexto completo
    contrato,
    aba,
    lider,

    // Primeira OM com coordenadas válidas (ou a primeira disponível)
    om: lider?.oms?.find(om =>
        this.parseCoordenadaBR(om.latitude) !== null &&
        this.parseCoordenadaBR(om.longitude) !== null
    ) || lider?.oms?.[0] || null

};

    },

     // ======================================
    //       COORDENADAS DO MAPA 
   // ======================================
    obterCoordenada(seed, aba, lider) {

    // 1 - Procura a primeira OM com coordenadas reais válidas
    //     (os valores vêm como texto e em formato BR, ex: "-2,564037")
    const omComCoordenada = lider?.oms?.find(om => {

        const lat = this.parseCoordenadaBR(om.latitude);
        const lng = this.parseCoordenadaBR(om.longitude);

        return lat !== null && lng !== null;

    });

    if (omComCoordenada) {

        return {

    lat: this.parseCoordenadaBR(omComCoordenada.latitude),
    lng: this.parseCoordenadaBR(omComCoordenada.longitude)

};

    }

    // 2 - Compatibilidade com versões antigas
    if (
        lider &&
        typeof lider.lat === "number" &&
        typeof lider.lng === "number"
    ) {

        return {
            lat: lider.lat,
            lng: lider.lng
        };

    }

    // 3 - Compatibilidade com versões antigas
    if (
        typeof aba.lat === "number" &&
        typeof aba.lng === "number"
    ) {

        return {
            lat: aba.lat,
            lng: aba.lng
        };

    }

    // 4 - Coordenada fictícia
    const raio = 0.011;

    return {

        lat:
            this.centroReferencia.lat +
            (this.pseudoAleatorio(`${seed}-lat`) - 0.5) * raio,

        lng:
            this.centroReferencia.lng +
            (this.pseudoAleatorio(`${seed}-lng`) - 0.5) * raio

    };

},

    // ======================================
    // Converte latitude/longitude vindas do JSON
    // do contrato para número.
    // ======================================
    parseCoordenadaBR(valor) {

        if (valor === null || valor === undefined) return null;

        if (typeof valor === "number") {
            return Number.isFinite(valor) ? valor : null;
        }

        const texto = String(valor).trim();

        if (!texto || texto.toLowerCase() === "null") return null;

        // Aceita tanto vírgula ("-2,564037") quanto ponto ("-2.564037")
        const numero = Number(texto.replace(",", "."));

        return Number.isFinite(numero) ? numero : null;

    },

    // ======================================
    // Gera um número pseudo-aleatório (0 a 1)
    // estável para uma mesma string — assim os
    // pinos não "pulam de lugar" a cada render
    // ======================================
    pseudoAleatorio(texto) {

        let hash = 0;

        for (let i = 0; i < texto.length; i++) {
            hash = (hash << 5) - hash + texto.charCodeAt(i);
            hash |= 0;
        }

        return (Math.abs(hash) % 1000) / 1000;

    },

    // ======================================
    // Define o status agregado de uma frente/líder
    // a partir do status das OMs do dia
    // ======================================
    calcularStatus(lider) {

        const oms = lider?.oms || [];

        if (!oms.length) return "planejada";

        const statusList = oms.map(om => this.normalizarStatus(om.status));

        if (statusList.includes("atrasada")) return "atrasada";
        if (statusList.includes("andamento")) return "andamento";
        if (statusList.every(s => s === "concluida")) return "concluida";

        return "andamento";

    },

    // ======================================
    // Normaliza o texto de status das OMs
    // (os dados vêm com grafias diferentes:
    // "Em andamento", "Concluída", "Postergada"...)
    // ======================================
    normalizarStatus(status) {

        const s = (status || "").trim().toLowerCase();

        if (!s) return "planejada";
        if (s.includes("posterg") || s.includes("atras")) return "atrasada";
        if (s.includes("andamento")) return "andamento";
        if (s.includes("conclu")) return "concluida";

        return "planejada";

    },

    // ======================================
    // Cria o ícone (pino) do marcador
    // ======================================
    criarIcone(dado) {

        const cfg = this.statusConfig[dado.status];

        return L.divIcon({
            className: "mapa-marker-divicon",
            html: `
                <div class="mapa-marker-wrap">
                    <div class="mapa-marker ${cfg.classe}"></div>
                    <div class="mapa-marker-label">
                        <span class="mapa-marker-tag ${cfg.classe}">${cfg.label}</span>
                        <strong>${dado.om?.frente}</strong>
                    </div>
                </div>
            `,
            iconSize: [34, 34],
            iconAnchor: [17, 34]
        });

    },

    // ======================================
    // Abre o painel lateral com os detalhes
    // da frente/líder selecionada
    // ======================================
    abrirPainel(dado) {

        const painel = document.getElementById("mapa-painel");
        const conteudo = document.getElementById("mapa-painel-conteudo");

        if (!painel || !conteudo) return;

        this.marcadorSelecionado = dado.id;

        conteudo.innerHTML = MapaPainel.render(
    dado,
    this.statusConfig
);

        painel.classList.add("aberto");

    },

    // ======================================
    // Fecha o painel lateral
    // ======================================
    fecharPainel() {

        document.getElementById("mapa-painel")?.classList.remove("aberto");
        this.marcadorSelecionado = null;

    },

};