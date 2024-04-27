const UserModel = require("../models/UserModel");
const validator = require('validator');
const passwordValidator = require('password-validator');
const bcrypt = require('bcrypt')
const ProductModel = require('../models/ProductModel')

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
    const { search, number, show } = req.query
    try {
        const allAccount = await UserModel.find({})
        const searchAll = allAccount.filter(item => item.username.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(
                search
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .toLowerCase(),
            ));
        const start = (parseInt(number) - 1) * parseInt(show);
        const end = start + parseInt(show);
        const newAll = searchAll.slice(start, end); 
        const totalPages = Math.ceil(searchAll.length / parseInt(show))
        res.status(200).json({
            data: newAll,
            length: totalPages
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const addFavorite = async (req, res) => {
    const idUser = req.params.id
    const { product } = req.body
    try {
        const favorite = await UserModel.findByIdAndUpdate(
            idUser,
            { $push: { favorite: { product: product } } },
            { new: true }
        )
        res.status(200).json(favorite)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const testFavorite = async (req, res) => {
    const idUser = req.params.id
    const { product } = req.query
    try {
        let bool = false
        const favorite = await UserModel.findOne({ _id: idUser, favorite: { $elemMatch: { product: product } } })
        if (favorite) {
            bool = true
        }
        res.status(200).json(bool)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const deleteFavorite = async (req, res) => {
    const idUser = req.params.id
    const { product } = req.body
    try {
        const favorite = await UserModel.findByIdAndUpdate(
            idUser,
            { $pull: { favorite: { product: product } } },
            { new: true }
        )
        res.status(200).json(favorite)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const allFavoriteByUser = async (req, res) => {
    const idUser = req.params.id
    try {
        const favoriteArray = await UserModel.findById(idUser, "favorite.product")
        const products = await Promise.all(
            favoriteArray.favorite.map( async item => {
                const product = await ProductModel.findById(item.product)
                return product
            })
        )
        res.status(200).json(products)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const numberFavoriteByProduct = async (req, res) => {
    const idProduct = req.params.id
    try {

        const favoriteArray = await UserModel.find({"favorite.product": idProduct})
        // const products = await Promise.all(
        //     favoriteArray.favorite.map( async item => {
        //         const product = await ProductModel.findById(item.product)
        //         return product
        //     })
        // )
        res.status(200).json(favoriteArray.length)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

module.exports = { 
    register, 
    updateAccount,
    getDetailAccount,
    getAllAccount,
    addFavorite,
    testFavorite,
    deleteFavorite,
    allFavoriteByUser,
    numberFavoriteByProduct
}