const AddressModel = require("../models/AddressModel")

const addAddress = async (req, res) => {
    const { province, district, ward, address, phone, main, user } = req.body
    if (!province || !district || !ward || !address || !phone || !user) {
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
    const { province, district, ward, address, phone, main, user } = req.body
    // const data = {province, district, ward, address, phone, main}
    const id = req.params.id
    // const existingAddress = await AddressModel.find({province, district, ward, address, phone, main})
    if (!province || !district || !ward || !address || !phone) {
        return res.status(400).json({
            message: 'Nhập đầy đủ thông tin'
        })
    }
    // if (existingAddress) {
    //     return res.status(400).json({
    //         message: 'Địa chỉ đã tồn tại'
    //     })
    // }
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
    // if (!existingAddress) {
    //     return res.status(200).json({
    //         message: "Không có địa chỉ nào"
    //     })
    // }
    try {
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
    getAllAddressByUser
}