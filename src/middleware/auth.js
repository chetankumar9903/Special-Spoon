const jwt =require("jsonwebtoken");
const Register = require("../models/register"); 

const auth = async(req, res, next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyuser=jwt.verify(token, process.env.SECRET_KEY);
        // console.log(verifyuser);

        const user=  await Register.findOne({_id:verifyuser._id});
        console.log(user.Username);   // any par can be print or whole also


        req.token =token;
        req.user=user;

        
        next();  // if it is not used then page struct on that only means keep on loading
        
    } catch (error) {
        res.status(401).render("error");
    }

}
module.exports = auth;