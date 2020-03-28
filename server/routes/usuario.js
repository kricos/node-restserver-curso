const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('./../models/usuario')
const app = express();

app.get('/usuario', function (req, res) {
    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;
    Usuario.find({estado: true}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite).exec((err, usuarios) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        Usuario.countDocuments({estado: true}, (err, cuantos) => {
            res.json({
                ok: true, 
                cuantos,
                usuarios});
        })
        
    });

    
});

app.post('/usuario', function (req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password , 10 ) ,
        role: body.role
    });
    
    usuario.save((err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
// usuarioDB.password = null;
        res.json({
            ok:true,
            usuario: usuarioDB
        })
    });
    
    
    
});

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','img','estado']);
    
    Usuario.findByIdAndUpdate( id, body, {new : true, runValidators: true}, (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                error: {
                    message: `Usuario ${id} no encontrado`
                }
            });
        }

        res.json({ok: true, id ,usuario: usuarioDB});
    } );
    
});

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;

    // Usuario.findByIdAndRemove( id , ( err, usuarioBorrado)=>{
    //     if(err){
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if(!usuarioBorrado){
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 message: `Usuario ${id} no encontrado`
    //             }
    //         });
    //     }
    //     res.json({ok:true, usuario:usuarioBorrado });
    // });
    body= {estado:false};

    Usuario.findByIdAndUpdate( id, body, {new : true, runValidators: true}, (err, usuarioBorrado) => {
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                error: {
                    message: `Usuario ${id} no encontrado`
                }
            });
        }
        res.json({ok: true, id ,usuario: usuarioBorrado});
    } );
    
});


module.exports = app;