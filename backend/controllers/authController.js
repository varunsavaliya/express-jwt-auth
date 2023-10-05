import User from "../models/user.schema.js";
import emailValidator from 'email-validator'
import bcrypt from 'bcrypt'
export const signup = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    console.log(name, email, password, confirmPassword);

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'Every field is required'
        })
    }

    const validEmail = emailValidator.validate(email);
    if (!validEmail) {
        return res.status(400).json({
            success: false,
            message: 'please provide valid email'
        })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: 'password and confirm password does not match'
        })
    }

    try {
        const user = User(req.body);

        const result = await user.save();

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Account already exists with same email'
            })
        }
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }

}


export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Every field is required'
        })
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        const token = user.jwtToken();
        user.password = undefined;

        const cookieOptions = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        }

        res.cookie("token", token, cookieOptions);

        res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const profile = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        return res.status(200).json({
            success: true,
            data: user
        })

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

export const logout = (req, res) => {
    try {
        const cookieOptions = {
            expires: new Date(),
            httpOnly: true
        }
        res.cookie("token", null, cookieOptions);

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}