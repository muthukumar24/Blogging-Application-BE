import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// JWT Token Creation
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// User Login
export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User Doesn't Exist"
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(isPasswordMatch){
            const token = createToken(user._id);
            res.status(200).json({
                success: true,
                token
            })
        }
        else {
            res.status(400).json({ 
                success: false,
                message: "Invalid Credentials"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

// User Registration
export const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Checking if User Already Exist
        const userExist = await userModel.findOne({ email });
        
        if(userExist){
            return res.status(400).json({
                success: false,
                message: "User already exist"
            })
        }

        // Validating email and strong password
        if(!validator.isEmail(email)){
            return res.status(400).json({
                success: false,
                message: "Please enter a valid Email"
            })
        }

        if(password.length < 8){
            return res.status(400).json({
                success: false,
                message: "Please enter a strong password"
            })
        }

        // Hashing User Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, 
            email,
            password: hashedPassword
        })

        const user  = await newUser.save();
 
        const token = createToken(user._id);

        res.status(200).json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};