// ======================================
// NAVEGAÇÃO ENTRE PÁGINAS
// ======================================

const paginas = document.querySelectorAll(".pagina");
const botoes = document.querySelectorAll(".menu-btn");

function abrirPagina(idPagina, botao) {

    console.log("Clique:", idPagina);

    // Esconde todas as páginas
    paginas.forEach(pagina => {
        pagina.classList.remove("ativa");
    });

    // Mostra a página selecionada
    const paginaSelecionada = document.getElementById(idPagina);

    if (paginaSelecionada) {
        paginaSelecionada.classList.add("ativa");
    } else {
        console.error(`Página '${idPagina}' não encontrada.`);
        return;
    }

    // Atualiza botão ativo
    botoes.forEach(btn => {
        btn.classList.remove("ativo");
    });

    if (botao) {
        botao.classList.add("ativo");
    }

    // Se for um contrato, atualiza o Dashboard e renderiza
    if (Dashboard && Dashboard.contratos && Dashboard.contratos[idPagina]) {

        Dashboard.contratoAtual = Dashboard.contratos[idPagina];

        console.log("Contrato carregado:", Dashboard.contratoAtual);

        Render.inicializar();

        console.log("Render executado.");
    }

    // Volta ao topo da página
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}