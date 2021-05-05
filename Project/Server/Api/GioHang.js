const express = require('express')
const route = express()
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

const { ObjectID } = require('bson');

const GioHangModel = require('../src/models/GioHangModel');
// Tạo API lấy dữ liệu từ MongoDB về
route.get('/giohang', async(req, res) => {
    GioHangModel.find({}).select({
        _id: 1,
        San_Pham: [{
            SanPham_id: 1,
            So_luong: 1,
        }],
    KhachHang_id: 1,
    Thoi_gian_cap_nhat: 1
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

route.post('/giohang/taomoi', async(req, res) => {
    console.log(req.body)
    var _id = new ObjectID()
    var San_Pham = [];
    var KhachHang_id = req.body.KhachHang_id;
    var Thoi_gian_cap_nhat = dateFormat();
// Kiểm tra m có tồn tại chưa
GioHangModel.findOne({
    _id: _id
})
.then(data =>{
    if(data){ //Nếu tồn tại thì thông báo đã tồn tại mã này rồi
        res.json('Giỏ hàng này đã tồn tại!');
    }else{
        // Kiểm tra email đã tồn tại chưa
       return GioHangModel.create({
            _id: _id,
            San_Pham: San_Pham,
            KhachHang_id: KhachHang_id,
            Thoi_gian_cap_nhat: Thoi_gian_cap_nhat
        })
    }
})
.then(dt => {
    res.json('Tạo giỏ hàng thành công!')
})
.catch (err =>{
    res.json(err)
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


// Hàm cập nhật
route.put('/giohang/capnhat/:_id', async(req, res) => {
    const KhachHang_id = req.params._id;
    const {San_Pham} = req.body;
    const Ngay_cap_nhat = dateFormat();
    GioHangModel.findOne({
        KhachHang_id: KhachHang_id
    }).then(data => {
          return GioHangModel.updateOne({
            KhachHang_id: KhachHang_id
            }, {
                San_Pham: San_Pham,
                Ngay_cap_nhat : Ngay_cap_nhat,
                }).then(data => {
                    res.json('Cập nhật giỏ hàng thành công!')
                })
               
    }).catch(err => {
        res.json('Không tìm thấy giỏ hàng này!')

    })
})

// Hàm cập nhật số lượng
route.put('/giohang/capnhat/soluong/:_id', async(req, res) => {
    const KhachHang_id = req.params._id;
    const {San_Pham} = req.body;
    const Ngay_cap_nhat = dateFormat();
    GioHangModel.findOne({
        KhachHang_id: KhachHang_id
    }).then(data => {
          return GioHangModel.updateOne({
            KhachHang_id: KhachHang_id
            }, {
                San_Pham: San_Pham,
                Ngay_cap_nhat : Ngay_cap_nhat,
                }).then(data => {
                    res.json('Cập nhật giỏ hàng thành công!')
                })
               
    }).catch(err => {
        res.json('Không tìm thấy giỏ hàng này!')

    })
})


//Export biến route để server.js có thể gọi các api được viết
module.exports = route;