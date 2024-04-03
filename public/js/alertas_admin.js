$(document).ready(function () {
    $('form').submit(function (event) {
      event.preventDefault();
      var formData = new FormData(this);

      $.ajax({
        url: $(this).attr('action'),
        type: $(this).attr('method'),
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
          if (response.success) {
            // Mostrar la alerta de éxito
            Swal.fire({
              title: 'Éxito',
              text: response.message,
              icon: 'success'
            });
          } else {
            // Mostrar la alerta de error
            Swal.fire({
              title: 'Error',
              text: response.message,
              icon: 'error'
            });
          }
        },
        error: function () {
          // Mostrar la alerta de error en caso de fallo de la solicitud AJAX
          Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al procesar la solicitud',
            icon: 'error'
          });
        }
      });
    });
  });