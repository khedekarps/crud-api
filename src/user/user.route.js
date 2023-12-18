const express = require("express");
var userRouter = express.Router();
const userController = require('./user.controller');

userRouter.get('/', (request, response) => {
    userController.getAllUsers(request, response);
});

userRouter.get('/:userId', (request, response) => {
    userController.getUserById(request, response);
});

userRouter.post('/', (request, response) => {
    userController.createUser(request, response);
});

userRouter.put('/:userId', (request, response) => {
    userController.updateUserById(request, response);
});

userRouter.delete('/:userId', (request, response) => {
    userController.deleteUserById(request, response);
});

module.exports = userRouter;