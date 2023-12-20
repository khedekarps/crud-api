const userModel = require("./user.model")
const { v4: uuidv4 } = require('uuid');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userModel.default.find();
        return res.status(200).json({ message: users });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
}

const isValidId = (id) => {
    const idPattern =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  
    return idPattern.test(id);
  };

exports.getUserById = async (req, res) => {
    try {
        if(!req.params.userId) {
            return res.status(400).json({ message: 'userId field required in request params.'});
        } else if (isValidId(req.params.userId)) {
        return res.status(400).json({ message: 'userId is invalid, not uuid.'});
        }
        const userId = req.params.userId;
      const user = await userModel.default.findOne({ id: userId });
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
            return res.status(400).json({ message:'Request body does not contain required field'});
        }
    const userId = uuidv4();
    const userData = req.body;
    const newUser = new userModel.default({
        username: userData.username,
        age: userData.age,
        hobbies: userData.hobbies,
        id: userId
      });
  
      const user = await newUser.save();
    return res.status(201).json({data: user});
    } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
    }
}

exports.updateUserById = async (req, res) => {
    try {
        if(!req.params.userId) {
            return res.status(400).json({ message: 'userId field required in request params.'});
        } else if(isValidId(req.params.userId)) {
            return res.status(400).json({ message: 'userId is invalid, not uuid.'});
        }
        if(!req.body) {
            return res.status(400).json({ message: 'requesy body data required to update user.'});
        }
        const userId = req.params.userId;
        const updatedUserData = req.body;
      const user = await userModel.default.findByIdAndUpdate(userId, updatedUserData, { new: true });
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
        } else if(isValidId(req.params.userId)) {
            return res.status(400).json({ message: 'userId is invalid, not uuid.'});
        }
        const userId = req.params.userId;
      const deletedUser = await userModel.default.findByIdAndDelete({ id: userId });
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
}