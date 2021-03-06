const express = require('express');
const bodyParser = require('body-parser');
require('./config/config');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

// habilitar public
app.use( express.static( path.resolve(__dirname , '../public')) );

// configuracion global de rutas
app.use( require('./routes/index') );

mongoose.connect(process.env.URLDB, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true, 
        useFindAndModify:false }, 
    (err, res)=>{
        console.log('urldb:',process.env.URLDB);
        if(err) throw err;
        console.log('Base de datos online')
    }).catch( err => {
        console.log('Database Error');
        console.log(err);
    } );



app.listen(process.env.PORT, () => {
    console.log('Escuchando enviroment: ', process.env.NODE_ENV);
    console.log('Escuchando urldb: ', process.env.URLDB);
    console.log('Escuchando puerto: ', process.env.PORT);
} )