const UserModel = require("../models/UserModel");
// const JwtService = require('../JwtService')
const validator = require('validator');
const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body
    const existingUser = await UserModel.findOne({ email: email })
    const schema = new passwordValidator();
    schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().symbols(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

    if (existingUser) {
        return res.status(400).json({
            message: "Email đã tồn tại"
        })
    }
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({
            message: "Yêu cầu nhập đầy đủ thông tin"
        })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            message: "Email không hợp lệ"
        })
    }
    if (!schema.validate(password)) {
        return res.status(400).json({
            message: "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự"
        })
    }
    if (confirmPassword !== password) {
        return res.status(400).json({
            message: "Mật khẩu không khớp"
        })
    }

    try {
        const salt = await bcrypt.genSalt(5);
        hashedPassword = await bcrypt.hash(password, salt);
        const user = await UserModel.create({ username, email, password: hashedPassword })
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

// const login = async (req, res) => {
//     const { email, password } = req.body
//     const existingUser = await UserModel.findOne({email: email})
//     const schema = new passwordValidator();
//     schema
//     .is().min(8)
//     .is().max(100)
//     .has().uppercase()
//     .has().lowercase()
//     .has().digits(1)
//     .has().symbols(1)
//     .has().not().spaces()
//     .is().not().oneOf(['Passw0rd', 'Password123']);

//     if (!email || !password) {
//         return res.status(400).json({
//             message: "Yêu cầu nhập đầy đủ thông tin"
//         })
//     }
//     if (!validator.isEmail(email)) {
//         return res.status(400).json({
//             message: "Email không hợp lệ"
//         })
//     }
//     if (!schema.validate(password)) {
//         return res.status(400).json({
//             message: "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự"
//         })
//     }
//     if (!existingUser) {
//         return res.status(400).json({
//             message: "Tài khoản không tồn tại"
//         })
//     }
//     if (existingUser && !(await bcrypt.compare(password, existingUser.password)))
//         return res.status(400).json({
//             message: "Mật khẩu không đúng"
//         })

//     try {
//         const data = {
//             id: existingUser._id, 
//             username: existingUser.username,
//             isAdmin: existingUser.isAdmin
//         }
//         const accessToken = await JwtService.accuracyAccessToken(data)
//         const refreshToken = await JwtService.accuracyRefreshToken(data)
//         res.status(200).json({
//             // data: existingUser,
//             accessToken: accessToken,
//             refreshToken: refreshToken 
//         })
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: "Đã có lỗi xảy ra",
//         })
//     }
// }

const updateAccount = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body
    const idUser = req.params.id
    const existingUser = await UserModel.findOne({ _id: {$ne: idUser} ,email: email })
    const schema = new passwordValidator();
    schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().symbols(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

    if (existingUser) {
        return res.status(400).json({
            message: "Email đã tồn tại"
        })
    }
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({
            message: "Yêu cầu nhập đầy đủ thông tin"
        })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            message: "Email không hợp lệ"
        })
    }
    if (!schema.validate(password)) {
        return res.status(400).json({
            message: "Mật khẩu phải ít nhất 8 ký tự bao gồm chữ hoa, chữ thường, số và ký tự"
        })
    }
    if (confirmPassword !== password) {
        return res.status(400).json({
            message: "Mật khẩu không khớp"
        })
    }
    try {
        const salt = await bcrypt.genSalt(5);
        hashedPassword = await bcrypt.hash(password, salt);
        const newUpdate = await UserModel.findByIdAndUpdate(idUser, { username, email, password: hashedPassword }, { new: true })
        res.status(200).json({newUpdate})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getDetailAccount = async (req, res) => {
    const idUser = req.params.id
    const existingUser = await UserModel.findById(idUser)
    if (!existingUser) {
        res.status(400).json({
            message: "Không tìm thấy người dùng"
        })
    }
    try {
        res.status(200).json(existingUser)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getAllAccount = async (req, res) => {
    try {
        const allAccount = await UserModel.find({})
        res.status(200).json(allAccount)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}


module.exports = { 
    register, 
    // login, 
    updateAccount,
    getDetailAccount,
    getAllAccount,
}