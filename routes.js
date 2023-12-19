const express = require("express");
var router=express.Router();
const usermodule = require('./src/user/user.route');

router.use('/users',usermodule);

module.exports = router;