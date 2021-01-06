require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const {dbConnection} = require('./database/config');

// Crear Servidor express
const app = express();

// Middleware CORS
app.use(cors());

// Lectura del body y parseo
app.use(express.json());

// Base de Datos
dbConnection();
// mean-user
// 48cWcsUdpVU3KCvY

// DIrectorio Publico
app.use(express.static('public'));
//Rutas
app.use('/api/usuarios', require('./routes/usuarios') ),
app.use('/api/hospitales', require('./routes/hospitales') ),
app.use('/api/medicos', require('./routes/medicos') ),
app.use('/api/todo', require('./routes/busquedas') ),
app.use('/api/login', require('./routes/auth') ),
app.use('/api/upload', require('./routes/uploads') ),

// lo ultimo
app.get('*',(req, res) => {

  res.sendFile(path.resolve(__dirname, 'public/index.html'));

});


app.listen(process.env.PORT, () =>{
console.log('Server onLine port ' + process.env.PORT);
});