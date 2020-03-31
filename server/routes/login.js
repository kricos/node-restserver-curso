const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('./../models/usuario')
const app = express();
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.G_CLIENT_ID);


app.post('/login', ( req , res )=>{

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                err: {
                    message:'Usuario o contraseña incorrectos'
                }
            });
        }

        if(! bcrypt.compareSync( body.password , usuarioDB.password )){
            return res.status(400).json({
                ok:false,
                err: {
                    message:'Usuario o contraseña incorrectos.'
                }
            });
        }

        let token = jwt.sign({
            usuario:usuarioDB
        },  process.env.SEED, {expiresIn: process.env.CADUCIDAD });
        res.json({
            ok:true,
            usuario: usuarioDB,
            token
        });
    });

    
});


// config google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.G_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);

    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
};


app.post('/google', async ( req , res )=>{
    let token = req.body.idtoken ;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok:false,
                err:e
            })
        });
    Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
        if(err){
            return res.status(500).json({
                ok:false,
                err
            });
        }
        if( usuarioDB ){
            if(usuarioDB.google === false){
                return res.status(400).json({
                    ok:false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                });
            }else{
                let token = jwt.sign({
                    usuario:usuarioDB
                },  process.env.SEED, {expiresIn: process.env.CADUCIDAD });
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            }
        }else{
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = googleUser.google;
            usuario.password = 'googleUser.nombre';
    
            usuario.save((err, usuarioDB)=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        err
                    });
                }
        
                let token = jwt.sign({
                    usuario:usuarioDB
                },  process.env.SEED, {expiresIn: process.env.CADUCIDAD });
                return res.json({
                    ok:true,
                    usuario: usuarioDB,
                    token
                });
            });
            
    
        }
    });

    
    // res.json({
    //     usuario: googleUser
    // });
});
module.exports = app;