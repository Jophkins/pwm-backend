import PostModel from '../models/Post.js';
import post from "../models/Post.js";


export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to get posts'
    });
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to get posts'
    });
  }
}

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedDocument = await PostModel.findOneAndUpdate({
      _id: postId
    }, {
      $inc: {viewsCount: 1}
    }, {
      new: true
    });

    if (!updatedDocument) {
      return res.status(404).json({
        message: 'post not found'
      });
    }

    res.json(updatedDocument);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to get posts'
    });
  }
}

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title, text: req.body.text, tags: req.body.tags, imageUrl: req.body.imageUrl, user: req.userId,
    });

    const post = await doc.save();

    res.json(post);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to create post'
    });
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const deletedDocument = await PostModel.findOneAndDelete({
      _id: postId
    });

    if (!deletedDocument) {
      return res.status(404).json({
        message: 'post not found'
      });
    }

    res.json({
      message: 'success'
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to delete post'
    });
  }
}

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const updatedDocument = await PostModel.updateOne({
      _id: postId
    }, {
      title: req.body.title, text: req.body.text, imageUrl: req.body.imageUrl, user: req.userId, tags: req.body.tags
    });

    res.json({
      success: true
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Unable to update post'
    });
  }
}

