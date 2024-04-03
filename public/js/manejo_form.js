document.addEventListener("DOMContentLoaded", () => {
    $(document).ready(function() {
        // Manejar el envío del formulario
        $('form').submit(function(event) {
            event.preventDefault(); // Prevenir el envío del formulario por defecto
    
            // Obtener el valor del campo de documento y el tipo de documento seleccionado
            const documento = $('#dni').val();
            const tipoDocumento = $('#selecionar').val();
    
            // Validar que se haya seleccionado un tipo de documento y que se haya ingresado un documento
            if (tipoDocumento === '0') {
                alert('Por favor selecciona un tipo de documento.');
                return;
            }
    
            if (!documento) {
                alert('Por favor ingresa un documento.');
                return;
            }
    
            // Realizar la solicitud AJAX al servidor
            $.ajax({
                url: '/user/certificado', // Ruta del servidor
                method: 'POST', // Método HTTP
                data: { tipoDocumento: tipoDocumento, dni: documento }, // Datos a enviar
                success: function(data) { // Función a ejecutar en caso de éxito
                    // Limpiar la tabla
                    $('tbody').empty();
    
                    // Iterar sobre los resultados y añadir filas a la tabla
                    data.forEach(function(certificado) {
                        $('tbody').append(`
                            <tr>
                                <td>${certificado.Documento}</td>
                                <td>${certificado.NombreCompleto}</td>
                                <td>${certificado.Nacionalidad}</td>
                                <td>${certificado.nCertificado}</td>
                                <td>${certificado.Codigo}</td>
                                <td>${formatDate(certificado.FechaEmicion)}</td>
                                <td>${formatDate(certificado.FechaVencimiento)}</td>
                                <td>
                                    <a href="/user/certificado/download/${certificado.id_Certificado}" class="btn btn-success">
                                        <i class="bi bi-download me-2"></i>
                                        Descargar
                                    </a>
                                </td>
                            </tr>
                        `);
                    });
                },
                // Función a ejecutar en caso de error
                error: function(xhr, status, error) { 
                    console.error('Error:', error);
                }
            });
        });
    });

    
})
