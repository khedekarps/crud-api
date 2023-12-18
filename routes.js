const express = require("express");
var router=express.Router();
const usermodule = require('./src/user/user.route');
// router.get("/",function(request,response){
// response.send("from routes.js")
// })

router.use('/users',usermodule);

module.exports = router;