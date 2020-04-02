const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const {verificaTokenImg} = require('./../middlewares/autenticacion')
app.get('/imagen/:tipo/:img',
    verificaTokenImg,
    (req, res) => {
    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImage = path.resolve( __dirname,`./../../uploads/${ tipo }/${ img }`);
    let pathNofound = path.resolve( __dirname, '../assets/fab.png');
    console.log(pathImage);
    if( fs.existsSync(pathImage)){
        res.sendFile( pathImage );
    }else{
        console.log('No encontrado');
        res.sendFile( pathNofound );
    }
    // path.resolve( __dirname, '../assets/fab.png')
    
})



// function borrarArchivo(nombreImagen, tipos ){
//     let pathImage = path.resolve(__dirname, `./../../uploads/${tipos}/${nombreImagen}`);
//     if( fs.existsSync(pathImage)){
//         fs.unlinkSync(pathImage);
//     }
// }

module.exports = app;