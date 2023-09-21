// const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    Username: {
        type : String,
        required:true,
        unique:true
    },

    Email:{
        type :String,
        required:true,
        unique:true
    },

    Password:{
        type :String,
        required:true
        
    },
    Confirmpassword:{
        type :String,
        required:true
        
    },

    tokens:[{
        token:{
            type :String,
            required:true
        }
    }]
});
// generating token
employeeSchema.methods.generateAuthToken = async function(){   //instance methods are used
    try {
        // console.log(this._id);
        const token= jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens= this.tokens.concat({token:token})   //({schemainside->token : token of jwt.sgn})
        await this.save();
        return token;

    } catch (error) {
        res.send("the error part"+ error);
        console.log("the error part"+ error)
        
    }
}

//converting password to hashing
employeeSchema.pre("save", async function(next){               //arrow func does not work here and next is also concept of miidleware
    
    
    if(this.isModified("Password")){ 
                   console.log("password" +this.Password);
    this.Password = await bcrypt.hash(this.Password, 10); //10 rounds default  more rounds take more time
    
    this.Confirmpassword = await bcrypt.hash(this.Password, 10);
}
    next();
})

//now we need to create a collection
const Register = mongoose.model('Register', employeeSchema);

module.exports = Register;

