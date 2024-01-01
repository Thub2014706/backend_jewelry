const UserModel = require("../models/UserModel");
const validator = require('validator');
const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

let refreshTokens = []

const accuracyAccessToken = (data) => {
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' })
}

const accuracyRefreshToken = (data) => {
    return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5m' })
}

const login = async (req, res) => {
    const { email, password } = req.body
    const existingUser = await UserModel.findOne({email: email})
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

    if (!email || !password) {
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
    if (!existingUser) {
        return res.status(400).json({
            message: "Tài khoản không tồn tại"
        })
    }
    if (existingUser && !(await bcrypt.compare(password, existingUser.password)))
        return res.status(400).json({
            message: "Mật khẩu không đúng"
        })

    try {
        const data = {
            id: existingUser._id, 
            username: existingUser.username,
            isAdmin: existingUser.isAdmin
        }
        const accessToken = accuracyAccessToken(data)
        const refreshToken = accuracyRefreshToken(data)
        refreshTokens.push(refreshToken)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, //bảo vệ cookie khỏi các tấn công XSS.
            secure: false,
            path: '/',
            sameSite: 'strict'
        })
        res.status(200).json({
            // data: existingUser,
            accessToken: accessToken,
            // refreshToken: refreshToken 
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const refreshToken = (req, res) => {
    try {
        const refresh = req.cookies.refreshToken
        if (!refresh) {
            return res.status(401).json({
                message: 'Không nhận được refresh token'
            })
        }
        if (!refreshTokens.includes(refresh)) {
            return res.status(403).json({
                message: 'refresh token không hợp lệ'
            })
        }
        jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err)
            }
            refreshTokens = refreshTokens.filter((token) => token !== refresh)
            const data = {
                id: user._id, 
                username: user.username,
                isAdmin: user.isAdmin
            }
            const newAccessToken = accuracyAccessToken(data)
            const newRefreshToken = accuracyRefreshToken(data)
            refreshTokens.push(newRefreshToken)
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true, //bảo vệ cookie khỏi các tấn công XSS.
                secure: false,
                path: '/',
                sameSite: 'strict'
            })
            res.status(200).json({
                accessToken: newAccessToken
            })
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const logout = async (req, res) => {
    res.clearCookie('refreshToken')
    refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken)
    res.status(200).json({
        message: 'Đã đăng xuất'
    })
}

module.exports = {
    login, 
    refreshToken,
    logout
}