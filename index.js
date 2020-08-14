
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();  
}

const express = require('express');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
var cors = require('cors')

//inicializacion 
const app = express();
app.use(cors())
require('./database');

//puerto
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/uploads'), 
    filename(req, file, cb){
        cb(null, new Date().getTime()+ path.extname(file.originalname));
    }
})
app.use(multer({storage}).single('image'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Routes
app.use(require('./routes/index.js'))

//Static files
app.use(express.static(path.join(__dirname,'public')));

//empezar servidor
app.listen(app.get('port'), ()=>{
    console.log('El puerto se encuentra en ', app.get('port'));
});