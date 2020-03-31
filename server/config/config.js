// Puerto
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// vencimiento 

process.env.CADUCIDAD = 60*60*24*30;

// seed de autenticacion

process.env.SEED = process.env.SEED || 'Secreto1234';

// cliend id google

process.env.G_CLIENT_ID = process.env.G_CLIENT_ID || '156240241286-feev27s3tbimpmv8sklmpln6a118pdde.apps.googleusercontent.com';

// Base de datos

let urlDB;

if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb+srv://fhernandez:m1aW5vWkM1SBj1Kn@cluster0-iwgld.mongodb.net/cafe?retryWrites=true&w=majority';
}

// mongodb+srv://fhernandez:m1aW5vWkM1SBj1Kn@cluster0-iwgld.mongodb.net/cafe


process.env.URLDB = process.env.URLDB || urlDB;