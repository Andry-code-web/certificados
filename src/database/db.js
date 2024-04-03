const mysql = require('mysql2'); // Importa la versión promise de mysql2
require('dotenv').config();

// Crea el objeto de conexión
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

// Conecta a la base de datos
connection.connect((error) => {
    if (error) {
        console.error("Error al conectar a la base de datos:", error);
        return;
    }
    console.log("Conectado a la base de datos");
});

// Exporta la conexión para su reutilización
module.exports = connection;


/* const mysql = require('mysql2'); // Importa la versión promise de mysql2
require('dotenv').config();

// Crea el pool de conexiones
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10, // Ajusta el límite de conexiones según sea necesario
    queueLimit: 0 // 0 para ilimitado
});

// Manejo de errores en la conexión
connection.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Se cerró la conexión a la base de datos');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Se ha excedido el límite de conexiones a la base de datos');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexión a la base de datos fue rechazada');
        }
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    if (connection) {
        connection.release();
        console.log('Conectado a la base de datos');
    }
});

// Exporta el pool de conexiones para su reutilización
module.exports = connection; */
