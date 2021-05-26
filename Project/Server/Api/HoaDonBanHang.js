const express = require('express')
const mongoose = require('mongoose')
//Khai báo biến chứa các hỗ trợ từ express
const route = express()

const nodemailer = require('nodemailer')
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
const { ObjectID } = require('bson');

// Dùng cho phương thức posts
var bodyParser = require('body-parser');
const HoaDonBanHangModel = require('../src/models/HoaDonBanHangModel');
route.use(bodyParser.urlencoded({extended: false}))
route.use(bodyParser.json())
// route.use(cors({origin: "*"}))

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/hoadonbanhang/thongtin', async(req, res) => {
    HoaDonBanHangModel.find({}).select({
        _id: 1,
        NhanVien_id: 1,
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
        Ngay_cap_nhat: 1
    }).exec((err, hoadonbanhangs) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({hoadonbanhangs})
        }
    })
})

route.post('/hoadonbanhang/taomoi', async(req, res) => {
    var _id = req.body._id
    var NhanVien_id = req.body.NhanVien_id;
    var San_Pham = req.body.San_Pham;
    var KhachHang_id = req.body.KhachHang_id;
    var Ho_ten = req.body.Ho_ten;
    var So_dien_thoai = req.body.So_dien_thoai;
    var Dia_chi = req.body.Dia_chi;
    var VanChuyen_id = req.body.VanChuyen_id;
    var ThanhToan_id = req.body.ThanhToan_id;
    var Tong_tien = req.body.Tong_tien;
    var Ngay_cap_nhat = req.body.Ngay_cap_nhat;

        // Kiểm tra email đã tồn tại chưa
       return HoaDonBanHangModel.create({
            _id: _id,
            NhanVien_id: NhanVien_id,
            San_Pham: San_Pham,
            KhachHang_id: KhachHang_id,
            Ho_ten: Ho_ten,
            So_dien_thoai: So_dien_thoai,
            Dia_chi: Dia_chi,
            VanChuyen_id: VanChuyen_id,
            ThanhToan_id: ThanhToan_id,
            Tong_tien: Tong_tien,
            Ngay_cap_nhat: Ngay_cap_nhat,
        }).then(dt => {
            res.json('Tạo hóa đơn bán hàng thành công!')
        }).catch (err =>{
            res.json(err)
        })
})
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;