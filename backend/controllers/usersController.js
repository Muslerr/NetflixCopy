import User from '../models/User.js';
import Content from '../models/Content.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils.js';

const signIn = async (req, res) => {
  const { password: passwordFromWebsite, email } = req.body;

  const user = await User.findOne({ email: email });

  if (user) {
    if (bcrypt.compareSync(passwordFromWebsite, user.password)) {
      res.send({
        _id: user._id,
        userName: user.userName,
        email: user.email,
        profilePicture: user.profilePicture,
        list: user.list,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: 'Invalid User/Password' });
};

const signUp = async (req, res) => {
  const { userName, email, password, profilePicture } = req.body;

  const newUser = new User({
    userName: userName,
    email: email,
    password: bcrypt.hashSync(password),
    isAdmin: false,
    list:[],
    profilePicture: profilePicture,
  });

  const user = await newUser.save();

  res.send({
    _id: user._id,
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture,
    token: generateToken(user),
  });
};

const addToList = async (req, res) => {
  const userId = req.user._id;
  const contentId = req.params.id;

  try {
    const user = await User.findById(userId);
    const content = await Content.findById(contentId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (!content) {
      return res.status(404).send({ message: 'Content not found' });
    }

    // Check if content is already in the user's list
    if (user.list.includes(content._id)) {
      console.log('Content already in');
      return res.status(400).send({ message: 'Content already in user list' });
    }

    user.list.push(content._id);
    await user.save();
    console.log('Content added to my list');
    res.status(201).send({ message: 'Content added to user list successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

const removeFromList = async (req, res) => {
  const userId = req.user._id;
  const contentId = req.params.id;

  try {
    const user = await User.findById(userId);
    const content = await Content.findById(contentId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (!content) {
      return res.status(404).send({ message: 'Content not found' });
    }

    user.list = user.list.filter((item) => !item.equals(content._id));
    await user.save();
    console.log("reomoved content");
    res.status(200).send({ message: 'Content removed from user list successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

const getMyList = async (req, res) => {
  const userId = req.user._id;
  
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    const userWithPopulatedList = await User.findById(userId)
      .populate({
        path: 'list',
        model: 'Content', // Adjust 'Content' to the actual model name
      })
      .exec();

    const list = userWithPopulatedList.list;

    
    res.status(200).send(list);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export { signIn, signUp, addToList, removeFromList, getMyList };
