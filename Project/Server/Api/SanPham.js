const express = require('express');
    // const { identity, result } = require('lodash')
const mongoose = require('mongoose');
const SanPhamModel = require('../src/models/SanPhamModel.js');
    // const route = express.Router()
const route = express();
const db = mongoose.connection;
const { ObjectID } = require('bson');
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/sanpham/thongtin', async(req, res) => {
    SanPhamModel.find({}).select({
        _id: 1,
        Ten_san_pham: 1,
        So_luong: 1,
        Danh_Muc: [{
            DML_id: 1,
            DMN_id: 1
        }],
        Gia: 1,
        Hinh_anh: 1,
        Mo_ta: 1,
        Danh_gia: [{
            KhachHang_id: 1,
            Noi_dung: 1,
            Hinh_anh: [{
                url: 1
            }],
            So_diem: 1,
            Ngay_danh_gia: 1,
            Ngay_cap_nhat: 1
        }],
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, sanphams) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            });
        } else {
            //Trả về dạng JSON
            res.json({sanphams});
        }
    });
});

route.post('/sanpham/taomoi', async(req, res) => {
    var _id = new ObjectID();
    var Ten_san_pham = req.body.Ten_san_pham;
    var Danh_Muc = req.body.Danh_Muc;
    var Gia = req.body.Gia;
    var Hinh_anh = req.body.Hinh_anh;
    var Mo_ta = req.body.Mo_ta;
    var Thoi_gian_cap_nhat = dateFormat();
    var Thoi_gian_tao = dateFormat();

return SanPhamModel.create({
    _id: _id,
    Ten_san_pham: Ten_san_pham,
    So_luong: 0,
    Danh_Muc: Danh_Muc,
    Gia: Gia,
    Hinh_anh: Hinh_anh,
    Mo_ta: Mo_ta,
    Thoi_gian_tao: Thoi_gian_tao,
    Thoi_gian_cap_nhat: Thoi_gian_cap_nhat
}).then(dt => {
    res.json('Tạo sản phẩm thành công!');
})
.catch (err =>{
    res.json(err);
});
});

// Hàm cập nhật
route.put('/sanpham/capnhatsanpham/:_id', async(req, res) => {
    // console.log(req.body)
    const _id = req.params._id;
    const {Ten_san_pham, Danh_Muc, Gia, Hinh_anh, Mo_ta} = req.body;
    const Thoi_gian_cap_nhat = dateFormat();
  
    SanPhamModel.findOne({
        _id: _id
    }).then(data => {
          return SanPhamModel.updateOne({
                _id: _id
            }, {
                Ten_san_pham: Ten_san_pham,
                Danh_Muc: Danh_Muc,
                Gia: Gia, 
                Hinh_anh: Hinh_anh, 
                Mo_ta: Mo_ta,
                Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                });
               
    }).then(data => {
        res.json('Cập nhật sản phẩm thành công!');
    }).catch(err => {
        res.json('Không tìm thấy sản phẩm này!');

    });
});

// Hàm cập nhật số lượng
route.post('/sanpham/capnhatsanpham/soluong', async(req, res) => {
    const arrSanPham = req.body;
    const Thoi_gian_cap_nhat = dateFormat();
  
    let length = arrSanPham.length;
    for (let i = 0; i < length; i++){
    SanPhamModel.updateOne({
        _id: arrSanPham[i]._id
    }, {
        So_luong: arrSanPham[i].So_luong,
        Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
        }).then(data => {
                // res.json(data);
                console.log(data)
            }).catch(err => {
                res.json('Không tìm thấy sản phẩm này!');
        
            });
    }    
});

// Hàm xóa một đối tượng 
route.delete('/sanpham/xoasanpham/:_id', async(req, res) => {
    const _id = req.params._id;
    SanPhamModel.deleteOne({
        _id: _id
    }).then(data => {
        if (data.deletedCount === 0){
            res.json({message: error});
        }
        else{
            res.json('Xóa sản phẩm thành công!');
        }
    });
});


// Hàm xóa nhiều đối tượng 
route.post('/sanpham/xoanhieusanpham', async(req, res) => {
    const arrSanPham = req.body;
    let length = arrSanPham.length;
    for (let i = 0; i < length; i++){
        SanPhamModel.deleteOne({
        _id: arrSanPham[i]
        }).then(data => {
        if (data.deletedCount === 0){
            res.json({message: err});
        }
        else{
            res.json('Xóa sản phẩm thành công!');
        }
        });
    }    
});
module.exports = route;