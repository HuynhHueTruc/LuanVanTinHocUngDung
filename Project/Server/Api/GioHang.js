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


route.post('/giohang/thongtin', async(req, res) => {
    var KhachHang_id = req.body.Khach_hang_id;
    GioHangModel.findOne({
        KhachHang_id: KhachHang_id,
    }).then(data => {
        if(data){
        res.json([data]);
        }else{
        res.json(false);

        }
    })
    .catch(err => {
        res.status(500).json('Lỗi server!')

    })
})

//Export biến route để server.js có thể gọi các api được viết
module.exports = route;