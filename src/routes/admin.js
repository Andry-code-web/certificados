const express = require("express");
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

//creamos una carpeta para almacenar los archivos
const upload = multer({ dest: 'uploads/' });

//coneccion a la base de datos
const coneccion = require("../database/db");

function requireLogin(req, res, next) {
    if (req.session && req.session.usuario) {
        // Si hay una sesión de usuario, pasa al siguiente middleware
        return next();
    } else {
        // Si no hay sesión de usuario, redirige al formulario de inicio de sesión
        return res.redirect('/admin/autenticacion/login');
    }
};

router.post('/autenticacion/login', (req, res) => {
    const usuario = req.body.usuario;
    const contraseña = req.body.password;

    // Consultar la base de datos para obtener el usuario con las credenciales proporcionadas
    coneccion.query('SELECT * FROM useradmin WHERE Usuario = ? AND Contraseña = ?', [usuario, contraseña], (error, results) => {
        if (error) {
            console.log("Error al autenticar el usuario" + error.stack);
            return res.status(500).send('Error al autenticar el usuario');
        }

        if (results.length > 0) {
            // Usuario autenticado correctamente
            // Almacena el nombre de usuario en la sesión
            req.session.usuario = usuario;
            res.redirect('/admin/Admistrador'); // Redirigir a la página del administrador
        } else {
            // Credenciales incorrectas
            res.render('login', { error: 'Usuario o contraseña incorrectos' }); // Volver a renderizar el formulario de inicio de sesión con un mensaje de error
        }
    });
});


router.get("/Admistrador", requireLogin, (req, res, next) => {
    const page = req.query.page || 1; // Página actual
    const limit = 10; // Número de resultados por página
    const offset = (page - 1) * limit; // Desplazamiento para la consulta SQL

    coneccion.query('SELECT * FROM segurid2_certificados.certificado LIMIT ? OFFSET ?', [limit, offset], (error, results, fields) => {
        if (error) {
            console.log("Error al traer los datos" + error.stack);
            return res.status(500).send('Error al obtener los datos');
        }

        // Formatear las fechas en cada resultado antes de enviarlo a la vista
        results.forEach(certificado => {
            certificado.FechaEmicion = formatDate(certificado.FechaEmicion);
            certificado.FechaVencimiento = formatDate(certificado.FechaVencimiento);
        });

        // Calcular el número total de páginas
        coneccion.query('SELECT COUNT(*) AS total FROM segurid2_certificados.certificado', (err, result) => {
            if (err) {
                console.log("Error al contar los registros" + err.stack);
                return res.status(500).send('Error al obtener los datos');
            }

            const totalRecords = result[0].total;
            const totalPages = Math.ceil(totalRecords / limit);

            // Pasar los datos, la página actual y el total de páginas a la vista
            res.render('admin', { certificados: results, formatDate: formatDate, page: page, totalPages: totalPages });
        });
    });
});

router.get("/autenticacion/login", (req, res, next)=>{
    res.render('login.ejs');
});

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        // La fecha no es válida, devuelve una cadena vacía o un mensaje de error
        return 'Fecha inválida';
    } else {
        // La fecha es válida, formatearla solo como fecha (sin hora)
        const formattedDate = date.toISOString().split('T')[0];
        return formattedDate; // Esto devuelve la fecha en formato 'YYYY-MM-DD'
    }
}

router.post('/image/single', upload.single('imagenCertificado'), (req, res) => {
    saveImageAndData(req.body, req.file)
        .then(() => {
            // Certificado almacenado en la base de datos
            res.json({ success: true, message: 'Certificado almacenado en la base de datos' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ success: false, message: 'Error al guardar el certificado en la base de datos' });
        });
});

function saveImageAndData(formData, file) {
    return new Promise((resolve, reject) => {
        const newPath = `./uploads/${file.originalname}`;
        fs.renameSync(file.path, newPath);

        const sql = `INSERT INTO certificado (TipoDocumento, Documento, NombreCompleto, Nacionalidad, nCertificado, Codigo, FechaEmicion, FechaVencimiento, dCertificado) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            formData.TipoDocumento,
            formData.Documento,
            formData.NombreCompleto,
            formData.Nacionalidad,
            formData.nCertificado,
            formData.Codigo,
            formData.FechaEmicion,
            formData.FechaVencimiento,
            newPath // Ruta de la imagen
        ];

        coneccion.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

router.post('/certificado/delete/:id', requireLogin, (req, res) => {
    const certificadoId = req.params.id;

    coneccion.query('DELETE FROM certificado WHERE id_Certificado = ?', [certificadoId], (error, result) => {
        if (error) {
            console.log("Error al eliminar el certificado" + error.stack);
            return res.status(500).send('Error al eliminar el certificado');
        }

        // Redirigir a la página del administrador después de eliminar el certificado
        res.redirect('/admin/Admistrador');
    });
});


module.exports = router;
