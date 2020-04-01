const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Categoria = require('./../models/categoria');
const { verificaToken, verificaAdmin_Role } = require('./../middlewares/autenticacion');
const app = express();

app.get('/categoria', 
    verificaToken,
    (req, res) => {
        Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, categoria) =>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Categoria.countDocuments({}, (err, cuantos) => {
                    res.json({
                        ok: true, 
                        cuantos,
                        categoria});
                });
            });
    });

app.get('/categoria/:id', 
    verificaToken,
    (req, res) => {
        Categoria.findById({_id: new mongoose.Types.ObjectId(req.params.id) }, 'descripcion usuario')
            .exec((err, categoria) =>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, cuantos) => {
                res.json({
                    ok: true, 
                    cuantos,
                    categoria});
            })
        });
    });

app.post('/categoria', 
    [verificaToken, verificaAdmin_Role], 
    (req, res) => {
        let body = req.body;
        let categoria = new Categoria({
            descripcion: body.descripcion,
            usuario: req.usuario._id
        });
        console.log('Post Categoria:', categoria);
        categoria.save((err, categoriaDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok:true,
                categoria: categoriaDB
            })
        });
});

app.put('/categoria/:id',
    [verificaToken, verificaAdmin_Role],
    (req, res) => {
        let id = req.params.id;
        let descCategoria = { descripcion : req.body.descripcion };
        Categoria.findByIdAndUpdate( 
            id,
            descCategoria, 
            {new : true, runValidators: true}, 
            (err, categoriaDB) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(!categoriaDB){
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: `Categoria ${id} no encontrado`
                        }
                    });
                }

                res.json({ok: true, id ,categoria: categoriaDB});
        } );
});

app.delete('/categoria/:id', 
    [verificaToken, verificaAdmin_Role],
    (req, res) => {
        let id = req.params.id;
        Categoria.findByIdAndRemove( id , ( err, categoriaBorrado)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if(!categoriaBorrado){
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: `Categoria ${id} no encontrado`
                    }
                });
            }
            res.json({ok:true, categoria:categoriaBorrado });
        });

        // body= {estado:false};
        // Usuario.findByIdAndUpdate( id, body, {new : true, runValidators: true}, (err, usuarioBorrado) => {
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
        //     res.json({ok: true, id ,usuario: usuarioBorrado});
        // } );
});


module.exports = app;