const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');


const connection = require("../database/db");

/* router.get("/certificado", (req, res, next) => {
    // Renderizar la plantilla EJS sin datos
    res.render('certificados.ejs', { certificados: [] });
}); */

router.get("/certificado", (req, res, next) => {
    // Renderizar la plantilla EJS sin datos
    res.render('certificados.ejs', { certificados: [], totalPages: 0, currentPage: 1, pageSize: 10 });
});


router.post('/certificado', (req, res) => {
    // Obtiene el número de documento del cuerpo de la solicitud
    const documento = req.body.dni;
    // Realiza la consulta a la base de datos
    connection.query('SELECT * FROM certificado WHERE Documento = ?', [documento], (error, results, fields) => {
        if (error) {
            console.error('Error querying database: ' + error.stack);
            return;
        }

        // Envía los resultados de la consulta como respuesta al cliente
        res.send(results);
    });
});

//para descargar certificado
router.get("/certificado/download/:id", (req, res) => {
    const certificadoId = req.params.id;

    // Realiza una consulta para obtener la ruta del archivo asociado al certificado
    connection.query('SELECT dCertificado FROM certificado WHERE id_Certificado = ?', [certificadoId], (error, results, fields) => {
        if (error) {
            console.error('Error querying database: ' + error.stack);
            return res.status(500).send('Error al obtener la ruta del archivo');
        }

        if (results.length === 0) {
            return res.status(404).send('Certificado no encontrado');
        }

        // La ruta del archivo está en la primera fila de los resultados
        const filePath = results[0].dCertificado.toString(); // Convertir a cadena de texto

        // Verificar si el archivo existe
        if (!fs.existsSync(filePath)) {
            return res.status(404).send('El archivo asociado al certificado no existe');
        }

        // Envía el archivo para descarga
        const fileName = path.basename(filePath);
        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error('Error al descargar el archivo:', err);
                return res.status(500).send('Error al descargar el archivo');
            }
        });
    });
});


module.exports = router;
