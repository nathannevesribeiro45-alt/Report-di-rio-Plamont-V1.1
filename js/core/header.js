// ==========================================
// HEADER.JS
// ==========================================

const Header = {

    render(contrato) {

        if (!contrato) {
            console.warn("Contrato não informado.");
            return;
        }

        const titulo = document.getElementById(
            `${contrato.id}-titulo`
        );

        const subtitulo = document.getElementById(
            `${contrato.id}-subtitulo`
        );

        const dataCard = document.getElementById(
            `${contrato.id}-data-card`
        );

        if (!titulo || !subtitulo || !dataCard) {
            console.error("Elementos do cabeçalho não encontrados.");
            return;
        }

        // Título
        titulo.textContent = contrato.nome;

        // Subtítulo
        subtitulo.textContent =
            `${contrato.turno} • ${contrato.horario}`;

        // Card da data
        dataCard.innerHTML = `
            📅 <strong>${contrato.data}</strong><br>
            🕐 ${contrato.turno}
        `;

    }

};