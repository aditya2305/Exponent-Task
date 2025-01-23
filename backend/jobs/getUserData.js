import User from '../models/userModel.js';

const getUserData = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findOne({ userId: id });
    if (!user) {
      user = new User({ userId: id, score: 0, prizes: 0 });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getUserData;
