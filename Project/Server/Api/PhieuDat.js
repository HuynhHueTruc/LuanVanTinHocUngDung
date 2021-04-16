const express = require('express')
const mongoose = require('mongoose')
//Khai báo biến chứa các hỗ trợ từ express
const route = express()

const nodemailer = require('nodemailer')
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

// Dùng cho phương thức posts
var bodyParser = require('body-parser');
const PhieuDatModel = require('../src/models/PhieuDatModel');
route.use(bodyParser.urlencoded({extended: false}))
route.use(bodyParser.json())
// route.use(cors({origin: "*"}))

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/phieudat/thongtin', async(req, res) => {
    PhieuDatModel.find({}).select({
        _id: 1,
        San_Pham: [{
            SanPham_id: 1,
            So_luong: 1,
            Gia_ban: 1
        }],
        KhachHang_id: 1,
        Ho_ten: 1,
        So_dien_thoai: 1,
        Dia_chi: [{
            Xa_Phuong: 1,
            Huyen_Quan: 1,
            Tinh_ThanhPho: 1
        }],
        VanChuyen_id: 1,
        ThanhToan_id: 1,
        Tong_tien: 1,
        Ngay_nhan: 1,
        Ngay_cap_nhat: 1,
        Trang_thai: 1
    }).exec((err, phieudats) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({phieudats})
        }
    })
})

// Hàm cập nhật
route.put('/phieudat/capnhatphieudat/:_id', async(req, res) => {
    // console.log(req.body)
    const _id = req.params._id;
    const {KhachHang_id, Ho_ten, So_dien_thoai, Dia_chi, VanChuyen_id, ThanhToan_id, Trang_thai, Tong_tien, San_Pham} = req.body;
    const Ngay_cap_nhat = dateFormat();
  
    PhieuDatModel.findOne({
        _id: _id
    }).then(data => {
          return PhieuDatModel.updateOne({
                _id: _id
            }, {
                KhachHang_id: KhachHang_id,
                Ho_ten: Ho_ten,
                So_dien_thoai: So_dien_thoai,
                Dia_chi: Dia_chi,
                VanChuyen_id: VanChuyen_id,
                ThanhToan_id: ThanhToan_id,
                Trang_thai: Trang_thai, Tong_tien: Tong_tien,
                San_Pham: San_Pham,
                Ngay_cap_nhat : Ngay_cap_nhat,
                }).then(data => {
                    res.json('Cập nhật phiếu đặt thành công!')
                })
               
    }).catch(err => {
        res.json('Không tìm thấy phiếu đặt này!')

    })
})


// Hàm xóa một đối tượng 
route.delete('/phieudat/xoaphieudat/:_id', async(req, res) => {
    const _id = req.params._id;
    PhieuDatModel.deleteOne({
        _id: _id
    }).then(data => {
        // if (data.deletedCount === 0){
        //      res.json('Phiếu đặt này không tồn tại!');
        // }
        // else{
            res.json('Xóa phiếu đặt thành công!');
        // }
    }).catch(err => {
        res.json({message: err});
    })
})


// Hàm xóa nhiều đối tượng 
route.post('/phieudat/xoanhieuphieudat', async(req, res) => {
    const arrPhieuDat = req.body;
    let length = arrPhieuDat.length;
    for (let i = 0; i < length; i++){
        PhieuDatModel.deleteOne({
        _id: arrPhieuDat[i]
        }).then(data => {
        // if (data.deletedCount === 0){
        //      res.json('Phiếu đặt này không tồn tại!');
        // }
        // else{
            res.json('Xóa phiếu đặt thành công!');
        // }
        }).catch(err => {
        res.json({message: err});
        })
    }    
})
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;