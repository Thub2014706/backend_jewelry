const ProductModel = require('../models/ProductModel')
const TypeProductModel = require('../models/TypeProductModel')

const addProduct = async (req, res) => {
    const { name, image, type, price, information, inStock, selled, discount, size } = req.body
    const existingProduct = await ProductModel.findOne({ name: name })
    if (!name || !type || !image || !price || !information ) {
        return res.status(400).json({
            message: "Nhập đầy đủ thông tin"
        })
    }
    if (existingProduct) {
        return res.status(400).json({
            message: "Tên sản phẩm đã tồn tại"
        })
    }
    try {
        const product = await ProductModel.create(req.body)
        res.status(200).json(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const updateProduct = async (req, res) => {
    const { name, image, type, price, information, inStock, selled, discount, size } = req.body
    const idProduct = req.params.id
    const data = { name, image, type, price, information, inStock, discount, size }
    const existingProduct = await ProductModel.findOne({ _id: { $ne: idProduct }, name: name })
    if (existingProduct) {
        return res.status(400).json({
            message: "Tên sản phẩm đã tồn tại"
        })
    }
    if (!name || !image || !type || !price || !information) {
        return res.status(400).json({
            message: "Nhập đầy đủ thông tin"
        })
    }
    try {
        const newProduct = await ProductModel.findByIdAndUpdate(idProduct, data, { new: true })
        res.status(200).json({newProduct})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const deleteProduct = async (req, res) => {
    const idProduct = req.params.id
    const existingProduct = await ProductModel.findOne({ _id: idProduct })
    if (!existingProduct) {
        return res.status(400).json({
            message: "Không tìm thấy sản phẩm"
        })
    }
    try {
        await ProductModel.findByIdAndDelete(idProduct)
        res.status(200).json({
            message: "Đã xóa"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getDetailProduct = async (req, res) => {
    const idProduct = req.params.id
    const existingProduct = await ProductModel.findById({ _id: idProduct })
    if (!existingProduct) {
        return res.status(200).json({
            message: "Sản phẩm không tồn tại"
        })
    }
    try {
        res.status(200).json(existingProduct)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getAllProduct = async (req, res) => {
    try {
        const allProduct = await ProductModel.find({})
        res.status(200).json(allProduct)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const createType = async (req, res) => {
    const { name, father } = req.body
    const existingType = await ProductModel.findOne({ name: name })
    if (existingType) {
        return res.status(400).json({
            message: 'Tên phân loại đã tồn tại'
        })
    }
    try {
        const type = await TypeProductModel.create(req.body)
        res.status(200).json(type)   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getAllType = async (req, res) => {
    try {
        const types = await TypeProductModel.find({})
        return res.status(200).json(types)   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

module.exports = { 
    addProduct, 
    updateProduct, 
    deleteProduct,
    getDetailProduct,
    getAllProduct,
    createType,
    getAllType,
}