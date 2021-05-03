const express = require('express')
const route = express()
const { ObjectID } = require('bson');

const GioHangModel = require('../src/models/GioHangModel');
// Tạo API lấy dữ liệu từ MongoDB về
route.get('/giohang', async(req, res) => {
    GioHangModel.find({}).select({
        _id: 1,
        San_Pham: [{
            SanPham_id: 1,
            So_luong: 1,
            Gia_ban: 1
        }],
    KhachHang_id: 1,
    }).exec((err, giohangs) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({giohangs})
        }
    })
})

//Export biến route để server.js có thể gọi các api được viết
module.exports = route;