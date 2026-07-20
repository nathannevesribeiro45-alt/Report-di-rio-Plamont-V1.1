// ======================================
// UTILITÁRIOS DO SISTEMA
// ======================================

/**
 * Atalho para document.querySelector()
 */
function $(seletor) {
    return document.querySelector(seletor);
}

/**
 * Atalho para document.querySelectorAll()
 */
function $$(seletor) {
    return document.querySelectorAll(seletor);
}

/**
 * Soma todos os valores numéricos encontrados
 * dentro das tags <strong> de uma lista.
 */
function somarLista(lista) {

    if (!lista) return 0;

    let total = 0;

    lista.querySelectorAll("strong").forEach(item => {

        const valor = parseInt(item.textContent.trim(), 10);

        if (!isNaN(valor)) {
            total += valor;
        }

    });

    return total;

}

/**
 * Mostra um elemento.
 */
function mostrarElemento(elemento) {

    if (elemento) {
        elemento.style.display = "";
    }

}

/**
 * Esconde um elemento.
 */
function esconderElemento(elemento) {

    if (elemento) {
        elemento.style.display = "none";
    }

}

/**
 * Atualiza o texto de um elemento.
 */
function atualizarTexto(elemento, texto) {

    if (elemento) {
        elemento.textContent = texto;
    }

}

/**
 * Limpa todo o conteúdo de um elemento.
 */
function limparElemento(elemento) {

    if (elemento) {
        elemento.innerHTML = "";
    }

}