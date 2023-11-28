import Post from "../models/Post.js";
import User from "../models/User.js";

/* Create a post */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);

    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();
    const posts = await Post.find().sort( { _id: -1 } ); //Get all posts and return it.
    res.status(201).json(posts);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* Get all posts */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().sort( { _id: -1 } );
    res.status(200).json(post);
  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

/* Get all posts of a particular user */
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({userId}).sort( { _id: -1 } );
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

/* Like / Dislike a post */
export const likePosts = async (req, res) => {
  try {

    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if(isLiked){
        post.likes.delete(userId);
    } else {
        post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        {likes: post.likes},
        {new: true}
    );
    res.status(200).json(updatedPost);

  } catch (err) {
    res.status(409).json({ error: err.message });
  }
};

//Add comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;   
    const { userId, comment } = req.body; 
    const commentedUser = await User.findById(userId);
    const newComment = {
      text: comment,
      commentedBy: userId,
      name: commentedUser.firstName + " " + commentedUser.lastName,
      picturePath: commentedUser.picturePath,
    }

    const updatedPost = await Post.findByIdAndUpdate(id, {
      $push:{comments:newComment}
    },{
      new:true
    });
    res.status(200).json(updatedPost);

  } catch (err) {
    res.status(409).json({ error: err.message });
  }

}
