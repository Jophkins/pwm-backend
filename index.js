import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {UserController, PostController} from './controllers/index.js';

import {registerValidation, loginValidation, postCreateValidation} from './validations.js'
import {handleValidationErrors, checkAuth} from "./utils/index.js";

const PORT = 7000;
mongoose.connect('mongodb://admin:5455@db.pitwithmagic.com:27017/blog')
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
app.use(cors());

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/registration', registerValidation, handleValidationErrors, UserController.register);

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

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);

app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log(`Server status ...ok. Server PORT is ${PORT}`);
});

