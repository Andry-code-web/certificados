const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');

const app = express();

app.use(express.urlencoded({ extended: true })); // Middleware para analizar datos codificados en la URL
app.use(express.json());

//configuracion de express-session
app.use(session({
    // Una clave secreta para firmar la cookie de sesión
    secret: 'secretClave', 
    resave: false,
    saveUninitialized: false,
    //creamos un espacio en la mmemoria para almacenar la sesion
    store: new session.MemoryStore()
}));

// Base de datos
require("./database/db");

// Routers para vistas
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

app.use('/user', usersRouter);
app.use("/admin", adminRouter);

// Configuraciones
app.set('PORT', process.env.PORT || 3003);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(morgan('dev'));

app.listen(app.get('PORT'), () => {
    console.log("Servidor en puerto 3003");
});
