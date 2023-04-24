import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

import {registerValidation, loginValidation, postCreateValidation} from './validations.js'
import checkAuth from "./utils/checkAuth.js";

const PORT = 7000;
mongoose.connect('mongodb+srv://admin:5455@pwm-cluster0.xj28tho.mongodb.net/blog?retryWrites=true&w=majority')
  .then(r => console.log(' DB is ok'))
  .catch(err => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname)
  },
});

const upload = multer({ storage });

app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/registration', registerValidation, UserController.register);

app.get('/auth/me', checkAuth, UserController.getUser);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  try {
    res.json({
      url: `/uploads/${req.file.originalname}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Image upload failure'
    });
  }
})

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log(`Server status ...ok. Server PORT is ${PORT}`);
});

