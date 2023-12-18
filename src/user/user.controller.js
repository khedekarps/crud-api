const userModel = require("./user.model")
const { v4: uuidv4 } = require('uuid');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        return res.status(201).json({ message: users });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
}

exports.getUserById = async (req, res) => {
    try {
        if(!req.params.userId) {
            return res.status(400).json({ message: 'userId field required in request params.'});
        }
        const userId = req.params.userId;
      const user = await UserModel.findOne({ id: userId });
      if (user) {
        return res.status(200).json({ data: user });
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.createUser = async (req, res) => {
    try {
        if(!req.body) {
            return res.status(400).json({ message:'Does not contain required field'});
        }
    const userId = uuidv4();
    const userData = req.body;
    const user = await userModel.create({ id: userId, data: userData });
    return res.status(200).json({data: user});
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.updateUserById = async (req, res) => {
    try {
        if(!req.params.userId) {
            return res.status(400).json({ message: 'userId field required in request params.'});
        }
        if(!req.body) {
            return res.status(400).json({ message: 'requesy body data required to update user.'});
        }
        const userId = req.params.userId;
        const updatedUserData = req.body;
      const user = await UserModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
      if (user) {
        return res.status(200).json({data: user});
      } else {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        if(!req.params.userId) {
            return res.status(400).json({ message: 'userId field required in request params.'});
        }
        const userId = req.params.userId;
      const deletedUser = await UserModel.findByIdAndDelete({ id: userId });
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
}