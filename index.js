import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import { UserController, PostController } from './controllers/index.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';


mongoose
    .connect('mongodb+srv://mrbondislav:root@cluster0.vxvl5.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err))


const app = express();

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads');
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname);
    },
});

app.get('/', (req, res) => {
    res.send('working')
})

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);


app.listen(3333, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('server ok');
});