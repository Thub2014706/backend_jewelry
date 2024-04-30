const { isEmpty } = require('validator')
const CommentModel = require('../models/CommentModel')
const ProductModel = require('../models/ProductModel')
const TypeProductModel = require('../models/TypeProductModel')
const fs = require('fs');
const path = require('path');

const addProduct = async (req, res) => {
    const { name, type, price, information, variants, selled, discount } = req.body
    const image = []
    req.files.map(item => { 
        image.push(item.filename)
    })
    console.log(req.files)
    const existingProduct = await ProductModel.findOne({ name: name })
    if (!name || !type  || !price || !information ) {
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
        const product = await ProductModel.create({
            name, type, price, information, variants: JSON.parse(variants), selled, discount, image
        })
        res.status(200).json(product)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getImages = (req, res) => {
    try {
        const { name } = req.params
        const imgPath = path.join(__dirname, '../../uploads', name)
        const image = fs.readFileSync(imgPath)
        const encode = image.toString('base64');
        res.writeHead(200, { 'Content-Type': 'image/jpeg' }); // thiet lap phan hoi voi mine la image/jpeg
        res.end(Buffer.from(encode, 'base64')) // ket thuc phan hoi va gui image duoi dang nhi phan
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const updateProduct = async (req, res) => {
    const { name, deleteImg, type, price, information, variants, selled, discount } = req.body
    const image = []
    if (JSON.parse(deleteImg).length > 0) {
        JSON.parse(deleteImg).map(element => {
            image.push(element)
        });
    }
    req.files.map(item => { 
        image.push(item.filename)
    })
    const idProduct = req.params.id
    const existingProduct = await ProductModel.findOne({ _id: { $ne: idProduct }, name: name })
    if (existingProduct) {
        return res.status(400).json({
            message: "Tên sản phẩm đã tồn tại"
        })
    }
    if (!name || !type || !price || !information) {
        return res.status(400).json({
            message: "Nhập đầy đủ thông tin"
        })
    }
    try {
        const data = { name, type, price, information, variants: JSON.parse(variants), selled, discount, image }
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
    const { search, number, show } = req.query
    try {
        const allProduct = await ProductModel.find({});
        const searchAll = allProduct.filter(item => item.name.normalize('NFD')
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

const allTypeNotSearch = async (req, res) => {
    try {
        const all = await TypeProductModel.find({})
        res.status(200).json(all)  
    } catch (error) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getAllType = async (req, res) => {
    const { search, number, show } = req.query
    try {
        const allType = await TypeProductModel.find({});
        const searchAll = allType.filter(item => item.name.normalize('NFD')
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

const getTypeByFather = async (req, res) => {
    const { father } = req.query
    try {
        const types = await TypeProductModel.find({father: father})
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

const filterAll = async (req, res) => {
    const { type, search, priceFrom, priceTo, numberStar, size, number, show } = req.query
    try {
        const products = await ProductModel.find({})
        const array = await Promise.all(products.map(async (item) => {
            let bool = true
            if (type) {
                let findType = await TypeProductModel.findOne({name: type})
                bool = bool && (item.type.equals(findType._id));
                // console.log(bool)
            }
            if (search) {
                bool = bool && item.name
                                .normalize('NFD')
                                .replace(/[\u0300-\u036f]/g, '')
                                .toLowerCase()
                                .includes(
                                    search
                                        .normalize('NFD')
                                        .replace(/[\u0300-\u036f]/g, '')
                                        .toLowerCase(),
                                )
            }
            if (priceFrom && priceTo) {
                bool = bool && 
                item.price - (item.price * item.discount / 100) >= priceFrom &&
                item.price - (item.price * item.discount / 100)  <= priceTo
            }
            if (numberStar) {
                bool = bool && item.numberStar >= numberStar
            }
            if (size && Array.isArray(size)) {
                bool = bool && item.variants.some((mini) => {
                    return size.some((mini2) => {
                        return mini.size === Number(mini2)
                    })                  
                })
            }
            else if (size) {
                bool = bool && item.variants.some((mini) => {
                    return mini.size === Number(size)
                })
            }
            return bool ? item : null
        }))
        // console.log(array)
        const data = array.filter(item => item !== null)
        const start = (parseInt(number) - 1) * parseInt(show);
        const end = start + parseInt(show);
        const newAll = data.slice(start, end); 
        const totalPages = Math.ceil(data.length / parseInt(show))
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

const randomProduct = async (req, res) => {
    try {
        const data = await ProductModel.find({})
        let random = data.filter((value) => value._id !== req.query.id).sort(() => Math.random() - 0.5)      
        return res.status(200).json(random.slice(0, req.query.length))   
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}



module.exports = { 
    addProduct, 
    getImages,
    updateProduct, 
    deleteProduct,
    getDetailProduct,
    getAllProduct,
    createType,
    getAllType,
    getTypeByFather,
    deleteType,
    updateType,
    getDetailType,
    getAllSize,
    allTypeNotSearch,
    filterByType,
    filterAll,
    randomProduct
}