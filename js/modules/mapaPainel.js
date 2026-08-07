// ======================================
// MAPAPAINEL.JS
// Responsável por renderizar o painel
// lateral do mapa.
// ======================================

const MapaPainel = {

    render(dado, statusConfig) {

    const cfg = statusConfig[dado.status];
    
    const lider = dado.lider;
    
    const contrato = dado.contrato;
    
    const aba = dado.aba;
    
    const om = dado.om;
    
    const recursos = aba?.recursos || [];

    const equipe = lider
        ? this.parseEquipe(lider.equipe)
        : [];

    const totalEquipe = equipe.reduce((soma, item) => soma + item.qtd, 0);

    return `
        <div class="mapa-painel-topo">
                <div class="mapa-painel-titulo">
                    <span class="mapa-painel-pino ${cfg.classe}"></span>
                    <div>
                        <h2>${om?.frente || lider?.lider || "Sem frente"}</h2>
                        <div class="mapa-painel-categoria">${aba?.nome || ""}</div>
                    </div>
                </div>
                <span class="mapa-painel-badge ${cfg.classe}">${cfg.label}</span>
            </div>

            <p class="mapa-painel-local">📍 ${contrato?.nome || ""}</p>

            ${lider ? `
                <div class="mapa-painel-secao">
                    <div class="mapa-painel-secao-titulo">👷 Líder responsável</div>
                    <div class="mapa-painel-lider-nome">${lider.lider}</div>
                    ${lider.telefone ? `
                        <div class="mapa-painel-lider-linha">
                            <span class="mapa-painel-telefone">📞 ${lider.telefone}</span>
                            <a class="mapa-painel-whats" href="https://wa.me/55${lider.telefone.replace(/\D/g, "")}" target="_blank" rel="noopener" title="Chamar no WhatsApp">
                                <svg fill="currentColor" viewbox="0 0 24 24"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4.1-.2 0-.4 0-.5-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4Z"></path><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3 .8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z"></path></svg>
                            </a>
                        </div>
                    ` : ""}
                </div>

                ${equipe.length ? `
                    <div class="mapa-painel-secao">
                        <div class="mapa-painel-secao-titulo">👥 Equipe do dia</div>
                        <div class="mapa-painel-lista">
                            ${equipe.map(item => `
                                <div class="mapa-painel-lista-linha">
                                    <span>${item.cargo}</span>
                                    <span>${item.qtd}</span>
                                </div>
                            `).join("")}
                            <div class="mapa-painel-lista-linha total">
                                <span>Total</span>
                                <span>${totalEquipe}</span>
                            </div>
                        </div>
                    </div>
                ` : ""}
            ` : `
                <div class="mapa-painel-secao">
                    <div class="mapa-painel-secao-titulo">ℹ️ Situação</div>
                    <p class="mapa-painel-obs vazio">Nenhuma equipe lançada para esta frente hoje.</p>
                </div>
            `}

            ${recursos.length ? `
                <div class="mapa-painel-secao">
                    <div class="mapa-painel-secao-titulo">🚚 Equipamentos</div>
                    <div class="mapa-painel-lista">
                        ${recursos.map(rec => `
                            <div class="mapa-painel-lista-linha">
                                <span>${rec.tipo}${rec.placa ? ` · ${rec.placa}` : ""}</span>
                                <span class="mapa-painel-status-dot operante">Operante</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            ` : ""}

            <div class="mapa-painel-secao">
                <div class="mapa-painel-secao-titulo">📝 Observações</div>
                <p class="mapa-painel-obs vazio">Nenhuma observação registrada para esta frente.</p>
            </div>

            <div class="mapa-painel-secao">
                <div class="mapa-painel-secao-titulo">📎 Anexos</div>
                <div class="mapa-painel-anexos">
                    <span class="mapa-painel-anexo pdf" title="Disponível em breve">
                        <svg fill="none" viewbox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path><path d="M14 2v6h6" stroke="currentColor" stroke-linejoin="round" stroke-width="2"></path></svg>
                        PDF da TR
                    </span>
                    <span class="mapa-painel-anexo fotos" title="Disponível em breve">
                        <svg fill="none" viewbox="0 0 24 24"><rect height="16" rx="2" stroke="currentColor" stroke-width="2" width="18" x="3" y="4"></rect><circle cx="8.5" cy="10" r="1.5" stroke="currentColor" stroke-width="2"></circle><path d="m21 15-5-5-9 9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path></svg>
                        Ver fotos
                    </span>
                </div>
            </div>
    `;

},

    parseEquipe(equipeTexto) {

        if (!equipeTexto) return [];

        return equipeTexto
            .split("+")
            .map(parte => parte.trim())
            .filter(Boolean)
            .map(parte => {

                const match = parte.match(/^(\d+)\s+(.+)$/);

                if (match) {
                    return {
                        qtd: parseInt(match[1], 10),
                        cargo: match[2]
                    };
                }

                return {
                    qtd: 1,
                    cargo: parte
                };

            });

    }

};