import User from '../models/userModel.js';

const incrementUserScore = async (req, res) => {
  try {
    const { id } = req.params;
    let user = await User.findOne({ userId: id });
    if (!user) {
      user = new User({ userId: id, score: 0, prizes: 0 });
    }
    user.score += 1;

    const randomForPoints = Math.random();
    const randomForPrize = Math.random();

    let gotPoints = false;
    let gotPrize = false;

    if (randomForPoints < 0.5) {
      user.score += 9;
      gotPoints = true;
    }

    if (randomForPrize < 0.25) {
      user.prizes += 1;
      gotPrize = true;
    }

    await user.save();
    res.json({
      score: user.score,
      prizes: user.prizes,
      gotPoints,
      gotPrize
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default incrementUserScore;
