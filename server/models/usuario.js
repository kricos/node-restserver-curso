const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { rolesValidos } = require('./../middlewares/autenticacion');
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.toJSON =function () {
    let user = this;
    let userObj = user.toObject();
    delete userObj.password;
    return userObj;
}
usuarioSchema.plugin(uniqueValidator,{ message: '{PATH} debe de ser único'});


module.exports = mongoose.model( 'Usuario', usuarioSchema);