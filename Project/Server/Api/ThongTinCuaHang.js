const express = require('express')
const mongoose = require('mongoose')
//Khai báo biến chứa các hỗ trợ từ express
const route = express()

const ThongTinCuaHangModel = require('../src/models/ThongTinCuaHangModel')

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/cuahang/thongtincuahang', async(req, res) => {
    ThongTinCuaHangModel.find({}).select({
        _id: 1,
        Ten_cua_hang: 1,
        Dia_chi: [{
            Xa_Phuong: 1,
            Huyen_Quan: 1,
            Tinh_ThanhPho: 1
        }],
        So_dien_thoai: 1,
        Banner: [{
            Hinh_anh: 1,
            Mo_ta: 1,
        }],
        Anh_dai_dien: 1,
        Gioi_thieu: 1
    }).exec((err, cuahangs) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({cuahangs})
        }
    })
})

// Tạo API cập nhật thông tin cửa hàng
route.put('/cuahang/capnhatthongtincuahang/:_id', async(req, res) => {
   try {
    console.log(req.body.Banner)
    const {Ten_cua_hang, Dia_chi, So_dien_thoai, Banner, Anh_dai_dien, Gioi_thieu} = req.body
    const _id = req.params._id
    ThongTinCuaHangModel.findOne({
        _id: _id
    }).then(data =>{
            ThongTinCuaHangModel.updateOne({
                _id: _id
            }, {
                Ten_cua_hang: Ten_cua_hang,
                Dia_chi: Dia_chi,
                So_dien_thoai: So_dien_thoai,
                Banner: Banner,
                Anh_dai_dien: Anh_dai_dien,
                Gioi_thieu: Gioi_thieu
            }).then(dt => {
                res.json('Cập nhật thành công!')
            }).catch(err => {
                res.json('Cập nhật thất bại!')
            })
        
    }).catch(e => {
        res.json(e)
    })
   } catch (error) {
       res.json(error)
   }
})

//Export biến route để server.js có thể gọi các api được viết
module.exports = route;