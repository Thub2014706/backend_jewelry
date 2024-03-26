const AddressModel = require("../models/AddressModel")
const OrderModel = require("../models/OrderModel")

const addAddress = async (req, res) => {
    const { name, province, district, ward, address, phone, main, user } = req.body
    if (!name || !province || !district || !ward || !address || !phone || !user) {
        return res.status(400).json({
            message: 'Nhập đầy đủ thông tin'
        })
    }
    try {
        if (main === true) {
            await AddressModel.findOneAndUpdate(
                { user: user, main: true }, 
                { $set: { main: false } }, 
                { new: true, upsert: false } // trả về tài liệu sau khi cập nhật và KHÔNG tạo mới nếu không tìm thấy tài liệu khớp
            )
        }
        const address = await AddressModel.create(req.body)
        res.status(200).json(address)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const updateAddress = async (req, res) => {
    const { name, province, district, ward, address, phone, main, user } = req.body
    const id = req.params.id
    if (!name || !province || !district || !ward || !address || !phone) {
        return res.status(400).json({
            message: 'Nhập đầy đủ thông tin'
        })
    }
    try {
        if (main === true) {
            await AddressModel.findOneAndUpdate(
                { user: user, main: true }, 
                { $set: { main: false } }, 
                { new: true, upsert: false } // trả về tài liệu sau khi cập nhật và KHÔNG tạo mới nếu không tìm thấy tài liệu khớp
            )
        }
        const address = await AddressModel.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(address)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getDetail = async (req, res) => {
    const id = req.params.id
    const existingAddress = await AddressModel.findById({_id: id})
    if (!existingAddress) {
        return res.status(200).json({
            message: "Địa chỉ không tồn tại"
        })
    }
    try {
        res.status(200).json(existingAddress)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

const getAllAddressByUser = async (req, res) => {
    const id = req.params.id
    const existingAddress = await AddressModel.find({user: id})
    try {
        res.status(200).json(existingAddress)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

// const getAllAddressByOrder = async (req, res) => {
//     const id = req.params.id
//     const existingAddress = await OrderModel.findOne({_id: id})
//     try {
//         res.status(200).json(existingAddress)
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({
//             message: "Đã có lỗi xảy ra",
//         })
//     }
// }

const allAdress = async (req, res) => {
    try {
        const existingAddress = await AddressModel.find({})
        res.status(200).json(existingAddress)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Đã có lỗi xảy ra",
        })
    }
}

module.exports = {
    addAddress, 
    updateAddress, 
    getDetail, 
    getAllAddressByUser,
    allAdress
}