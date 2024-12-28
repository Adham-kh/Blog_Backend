import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation, LoginValidation, postCreateValidation } from './validations/auth.js'


import { check } from './utils/checkAuth.js';

import { register, login, getMe } from './controllers/UserController.js';


import { create, getAll, getOne, removePost, update } from './controllers/PostController.js'



const app = express();

const port = 5000;
mongoose.connect('mongodb://127.0.0.1:27017/BlogDB')
.then(() => console.log('database connected successfully'))
.catch(() => console.log('Erroe message', err));

//for reading JSON formats
app.use(express.json());

const storage = multer.diskStorage({
    destination: ( _, __, cb) => {
        cb(null, 'upload')
    },
    filename: ( _, file, cb) => {
        cb(null, file.originalname);
    },
});



const upload = multer({ storage });

app.get('/', (req, res) => {

    res.send('Adham111');
    res.end();

});


app.post('/auth/login', LoginValidation, login);
app.post('/auth/register', registerValidation, register);
app.get('/auth/me', check, getMe);

app.post('/upload', check, upload.single('image'), (req, res) => {
    res.json({
        url: `/upload/${req.file.originalname}`,
    });
});

app.post('/posts', check, postCreateValidation, create);

app.get('/posts/:id', postCreateValidation, getOne);
app.get('/posts', postCreateValidation, getAll);


app.delete('/posts/:id', check, postCreateValidation, removePost);
app.patch('/posts/:id', check, postCreateValidation, update);

app.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server runing on port ' + port);
});



