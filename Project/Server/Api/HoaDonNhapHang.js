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
const HoaDonNhapHangModel = require('../src/models/HoaDonNhapHangModel');
route.use(bodyParser.urlencoded({extended: false}))
route.use(bodyParser.json())
// route.use(cors({origin: "*"}))

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/hoadonnhaphang/thongtin', async(req, res) => {
    HoaDonNhapHangModel.find({}).select({
        _id: 1,
        NhanVien_id: 1,
        San_Pham: [{
            SanPham_id: 1,
            So_luong: 1,
            Gia_nhap: 1
        }],
        Chu_thich: 1,
        Tong_tien: 1,
        Ngay_nhap: 1
    }).exec((err, hoadonnhaphangs) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({hoadonnhaphangs})
        }
    })
})


route.post('/hoadonnhaphang/taomoi', async(req, res) => {
    var _id = new ObjectID()
    var NhanVien_id = req.body.NhanVien_id;
    var San_Pham = req.body.San_Pham;
    var Chu_thich = req.body.Chu_thich;
    var Tong_tien = req.body.Tong_tien;
    var Ngay_nhap = dateFormat();

        // Kiểm tra email đã tồn tại chưa
       return HoaDonNhapHangModel.create({
            _id: _id,
            NhanVien_id: NhanVien_id,
            San_Pham: San_Pham,
            Chu_thich: Chu_thich,
            Tong_tien: Tong_tien,
            Ngay_nhap: Ngay_nhap,
        }).then(dt => {
            res.json('Tạo hóa đơn nhập hàng thành công!')
        }).catch (err =>{
            res.json(err)
        })
})


//Export biến route để server.js có thể gọi các api được viết
module.exports = route;