// En utils.js
function formatDate(dataformat) {
    const date = new Date(dataformat);
    if (isNaN(date.getTime())) {
        // La fecha no es válida, devuelve una cadena vacía
        return 'Fecha inválida';
    } else {
        // La fecha es válida, devuelve la parte de la fecha formateada
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
