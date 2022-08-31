const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const fileDelete = require('./middleware/file-delete');

const app = express();

app.use(bodyParser.json());

// app.use('/uploads/images',express.static(path.join('uploads','images')));

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods','GET,PATCH,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials','true');
    next();
})

app.use('/api/places',placesRoutes);
app.use('/api/users',usersRoutes);

app.use((req,res,next)=> {
    const error = new HttpError("Page Not Found!",404);
    throw error;
})

app.use((error,req,res,next) => {
    
    if (req.file){
        fileDelete(req.file.location);
    }

    // Below code was for deleting files from folder
    /*if(req.file){
        fs.unlink(req.file.path, err => {});
    }*/

    if(res.headerSent){
        return next(error);
    }
    const status = error.status;
    res.status (status || 500);
    res.json ({message : error.message || "An unknown error occured!"});
})

mongoose.
    connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xp02h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(()=> {
        app.listen(process.env.PORT || 5000, console.log('Connected'));
    })
    .catch(err => console.log(err));