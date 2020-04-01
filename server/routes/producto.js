const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Producto = require('./../models/producto');
const { verificaToken, verificaAdmin_Role } = require('./../middlewares/autenticacion');
const app = express();

app.get('/producto', 
    verificaToken,
    (req, res) => {
        let desde = Number(req.query.desde) || 0;
        Producto.find({})
            .skip(desde)
            .limit(5)
            .sort('nombre')
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, producto) =>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Producto.countDocuments({}, (err, cuantos) => {
                    res.json({
                        ok: true, 
                        cuantos,
                        producto});
                });
            });
    });

app.get('/producto/:id', 
    verificaToken,
    (req, res) => {
        Producto.findById({_id: new mongoose.Types.ObjectId(req.params.id) })
            .populate('usuario')
            .populate('categoria')
            .exec((err, producto) =>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({}, (err, cuantos) => {
                res.json({
                    ok: true, 
                    cuantos,
                    producto});
            })
        });
    });

app.get('/producto/buscar/:termino',
    verificaToken,
    (req, res) => {
        let termino = req.params.termino;
        let regex = new RegExp(termino, 'i');

        Producto.find({ nombre : regex })
            .limit(10)
            .sort('nombre')
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion')
            .exec((err, producto) =>{
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Producto.countDocuments({}, (err, cuantos) => {
                    res.json({
                        ok: true, 
                        cuantos,
                        producto});
                });
            });
    });


app.post('/producto', 
    verificaToken, 
    (req, res) => {
        let body = req.body;
        let producto = new Producto({
            ...body
        });
        producto.save((err, productoDB) => {
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok:true,
                producto: productoDB
            })
        });
});

app.put('/producto/:id',
    [verificaToken, verificaAdmin_Role],
    (req, res) => {
        let id = req.params.id;
        let body = req.body;
        let producto = { ...body };
        Producto.findByIdAndUpdate( 
            id,
            producto, 
            {new : true, runValidators: true}, 
            (err, productoDB) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(!productoDB){
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: `Producto ${id} no encontrado`
                        }
                    });
                }

                res.json({ok: true, id ,producto: productoDB});
            } );
});

app.delete('/producto/:id', 
    [verificaToken, verificaAdmin_Role],
    (req, res) => {
        let id = req.params.id;
        Producto.findById(id,
            {new : true, runValidators: true}, 
            (err, productoDB) => {
                if(err){
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if(!productoDB){
                    return res.status(400).json({
                        ok: false,
                        error: {
                            message: `Producto ${id} no encontrado`
                        }
                    });
                }
                console.log(productoDB);

                productoDB.disponible = false;
                productoDB.save((err, productoBorrado )=>{
                    if(err){
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    if(!productoBorrado){
                        return res.status(400).json({
                            ok: false,
                            error: {
                                message: `Producto ${id} no encontrado`
                            }
                        });
                    }
                    res.json({ok: true, id ,producto: productoBorrado});
                });

                
            } );

        
});


module.exports = app;