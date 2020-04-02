const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('./../models/usuario');
const Producto = require('./../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message:'No se ha seleccionado ningun archivo'
            }
        });
      }
    let archivo = req.files.archivo;
// validar tipo
    let tiposValidos= ['productos', 'usuarios'];
    if( tiposValidos.indexOf(tipo) < 0  ){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Tipos permitidas son : '+tiposValidos.join(', ')
            }
        })
    }
//extensiones permitidas
    let extensionesValidas = ['png','gif'];
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length-1].toLowerCase();

    if( extensionesValidas.indexOf(extension) < 0  ){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Extensiones permitidas son : '+extensionesValidas.join(', '),
                ext: extension
            }
        })
    }
    nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;
    archivo.mv(`./uploads/${ tipo }/${nombreArchivo}`, (err) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if( tipo === 'usuarios' ){
            imagenUsuario(id, res ,nombreArchivo);
        }else{
            imagenProducto(id, res ,nombreArchivo);
        }
        
    });
      
});

function imagenProducto(id, res, nombreArchivo){
    
    Producto.findById(id, (err, productosDB)=>{
        if(err){
            borrarArchivo(nombreArchivo,'productos');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!productosDB){
            borrarArchivo(nombreArchivo,'productos');
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Proucto no existe'
                }
            });
        }
        
        borrarArchivo(productosDB.img,'productos');

        productosDB.img = nombreArchivo;
        productosDB.save( (err, productoGuardado) => {
            res.json({
                ok:true,
                producto: productoGuardado,
                img: nombreArchivo,
                message: 'Archivo cargado correctamente'
            })
        });
        
    });
}

function imagenUsuario(id, res, nombreArchivo ){
    Usuario.findById(id, (err, usuarioDB)=>{
        if(err){
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            borrarArchivo(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'Usuario no existe'
                }
            });
        }
        // let pathImage = path.resolve(__dirname, `./../../uploads/usuarios/${usuarioDB.img}`);
        // if( fs.existsSync(pathImage)){
        //     fs.unlinkSync(pathImage);
        // }
        borrarArchivo(usuarioDB.img,'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save( (err, usuarioGuardado) => {
            res.json({
                ok:true,
                usuario: usuarioGuardado,
                img: nombreArchivo,
                message: 'Archivo cargado correctamente'
            })
        });
        
    });
}

function borrarArchivo(nombreImagen, tipos ){
    let pathImage = path.resolve(__dirname, `./../../uploads/${tipos}/${nombreImagen}`);
    if( fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage);
    }
}

module.exports=app;