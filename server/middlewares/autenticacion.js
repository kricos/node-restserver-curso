const jwt = require('jsonwebtoken');

const ADMIN_ROLE = 'ADMIN_ROLE';
const SUPER_ROLE = 'SUPER_ROLE';
const USER_ROLE = 'USER_ROLE';

let rolesValidos = {
    values: [ ADMIN_ROLE , SUPER_ROLE, USER_ROLE],
    message: '{VALUE}  no es un rol valido'
};

// verificar token

let verificaToken = ( req , res, next ) =>{
    let token = req.get('token');
    console.log('verificaToken');
    jwt.verify( token, process.env.SEED, (err, decoded) => {
        if(err){
            return res.status(401).json({
                ok:false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

let verificaAdmin_Role = ( req , res, next ) =>{
    let usuario = req.usuario;
    console.log('verificaAdmin_Role');
    
    if( usuario.role != ADMIN_ROLE ){
        return res.status(401).json({
            ok:false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
    next();

}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    rolesValidos
}