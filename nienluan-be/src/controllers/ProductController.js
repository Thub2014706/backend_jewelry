const CommentModel = require('../models/CommentModel')
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
    const existingType = await TypeProductModel.findOne({ name: name })
    if (existingType) {
        return res.status(400).json({
            message: 'Tên phân loại đã tồn tại'
        })
    }
    if (!name) {
        return res.status(400).json({
            message: 'Nhập đầy đủ thông tin'
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

const deleteType = async (req, res) => {
    const id = req.params.id
    const type = await TypeProductModel.findOne({_id: id})
    const nameType = type.name
    const idName = await TypeProductModel.find({ father: nameType })
    console.log(idName)
    idName.map(async (item) => 
        await TypeProductModel.findByIdAndUpdate({ _id: item._id }, { father: null }, { new: true })
    )
    try {
        await TypeProductModel.findByIdAndDelete(id)
        return res.status(200).json({
            message: 'Xoá thành công'
        })   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const updateType = async (req, res) => {
    const idType = req.params.id
    const { name, father } = req.body
    const existingType = await TypeProductModel.findOne({ name: name, _id: { $ne: idType } })
    if (existingType) {
        return res.status(400).json({
            message: 'Tên phân loại đã tồn tại'
        })
    }
    try {
        const data = await TypeProductModel.findByIdAndUpdate(idType, req.body, {new: true})
        return res.status(200).json(data)   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getDetailType = async (req, res) => {
    const idType = req.params.id
    try {
        const types = await TypeProductModel.findOne({_id: idType})
        return res.status(200).json(types)   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getAllSize = async (req, res) => {
    try {
        const sizes = await ProductModel.find({}, "variants.size")
        return res.status(200).json(sizes)   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

// const searchProduct = async (req, res) => {
//     const { priceFrom, priceTo } = req.query
//     try {
//         const data = await ProductModel.find({ price: { $gte: priceFrom, $lte: priceTo } })
//         return res.status(200).json(data)   
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: "Đã có lỗi xảy ra",
//         })
//     }
// }

const filterByPrice = async (req, res) => {
    const { priceFrom, priceTo } = req.query
    try {
        const data = await ProductModel.find({ price: { $gte: priceFrom, $lte: priceTo } })
        return res.status(200).json(data)   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const filterByType = async (req, res) => {
    const id = req.params.id
    try {
        const data = await ProductModel.find({ type: id })
        return res.status(200).json(data)   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

// const filterAll = async (req, res) => {
//     const { priceFrom, priceTo, numberStar, size } = req.query
//     try {
//         let data = []
//         if (priceFrom && priceTo && numberStar && size) {
//             data = await ProductModel.find({ 
//                 price: { $gte: priceFrom, $lte: priceTo }, 
//                 numberStar: {$gte: numberStar}, 
//                 "variants.size": size
//             })        
//         } else if (priceFrom && priceTo && numberStar) {
//             data = await ProductModel.find({ 
//                 price: { $gte: priceFrom, $lte: priceTo }, 
//                 numberStar: {$gte: numberStar}, 
//             })    
//         } else if (priceFrom && priceTo) {
//             data = await ProductModel.find({ price: { $gte: priceFrom, $lte: priceTo } })
//         } else if (numberStar) {
//             data = await ProductModel.find({ 
//                 numberStar: {$gte: numberStar}, 
//             })    
//         } else if (size) {
//             data = await ProductModel.find({ "variants.size": size })
//         }
//         return res.status(200).json(data)   
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: "Đã có lỗi xảy ra",
//         })
//     }
// }

const filterAll = async (req, res) => {
    const { priceFrom, priceTo, numberStar, size } = req.query
    try {
        const products = await ProductModel.find({})
        const array = await Promise.all(products.filter((item) => {
            let bool = true
            if (priceFrom && priceTo) {
                bool = bool && item.price >= priceFrom && item.price <= priceTo
            }
            if (numberStar) {
                bool = bool && item.numberStar >= numberStar
            }
            if (size) {
                bool = bool && item.variants.map(mini => mini.size === size)
            }
            return bool
        }))
        return res.status(200).json(array)   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const filterByStar = async (req, res) => {
    const { numberStar } = req.body
    try {
        const products = await CommentModel.find({ star: { $gte: numberStar } })
        const data = await Promise.all(products.map(async (item) => await ProductModel.find({_id: item.product})))
        // await ProductModel.find({_id: products.product})
        return res.status(200).json(data)   
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
    deleteType,
    updateType,
    getDetailType,
    getAllSize,
    filterByPrice,
    filterByStar,
    filterByType,
    filterAll
}