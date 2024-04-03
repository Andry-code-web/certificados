document.addEventListener("DOMContentLoaded", () => {
    // Función para manejar el envío del formulario
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Obtener el valor seleccionado en el select
        const selectValue = document.getElementById('selecionar').value;
        // Obtener el texto de la opción seleccionada
        const selectText = document.getElementById('selecionar').options[document.getElementById('selecionar').selectedIndex].text;
        // Actualizar el contenido del elemento con el id 'valor_selector'
        document.getElementById('valor_selector').textContent = selectText;

        // Realizar aquí cualquier otra acción necesaria, como enviar la solicitud AJAX al servidor
        // ...
    });
});
