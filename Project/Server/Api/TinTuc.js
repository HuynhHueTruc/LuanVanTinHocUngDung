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
const TinTucModel = require('../src/models/TinTucModel');
route.use(bodyParser.urlencoded({extended: false}))
route.use(bodyParser.json())
// route.use(cors({origin: "*"}))

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/tintuc/thongtin', async(req, res) => {
    TinTucModel.find({}).select({
        _id: 1,
        Tieu_de: 1,
        NhanVien_id: 1,
        Noi_dung: 1,
        Anh_dai_dien: 1,
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, tintucs) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({tintucs})
        }
    })
})


route.post('/tintuc/taomoi', async(req, res) => {
    var _id = new ObjectID()
    var Tieu_de = req.body.Tieu_de;
    var NhanVien_id = req.body.NhanVien_id;
    var Noi_dung = req.body.Noi_dung;
    var Anh_dai_dien = req.body.Anh_dai_dien;
    var Thoi_gian_cap_nhat = dateFormat();
    var Thoi_gian_tao = dateFormat();

        // Kiểm tra email đã tồn tại chưa
       return TinTucModel.create({
            _id: _id,
            Tieu_de: Tieu_de,
            NhanVien_id: NhanVien_id,
            Noi_dung: Noi_dung,
            Anh_dai_dien: Anh_dai_dien,
            Thoi_gian_tao: Thoi_gian_tao,
            Thoi_gian_cap_nhat: Thoi_gian_cap_nhat
        }).then(dt => {
            res.json('Tạo tin tức thành công!')
        }).catch (err =>{
    res.json(err)
})
})

// Hàm cập nhật
route.put('/tintuc/capnhattintuc/:_id', async(req, res) => {
    const _id = req.params._id;
    const {Tieu_de, NhanVien_id, Noi_dung, Anh_dai_dien} = req.body;
    console.log(req.body, _id)

    const Thoi_gian_cap_nhat = dateFormat();
  
    TinTucModel.findOne({
        _id: _id
    }).then(data => {
          return TinTucModel.updateOne({
                _id: _id
            }, {
                Tieu_de: Tieu_de,
                NhanVien_id: NhanVien_id,
                Noi_dung: Noi_dung,
                Anh_dai_dien: Anh_dai_dien,
                Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                }).then(data => {
                    res.json('Cập nhật tin tức thành công!')
                })
               
    }).catch(err => {
        res.json('Không tìm thấy tin tức này!')
    })
})

// Hàm xóa một đối tượng 
route.delete('/tintuc/xoatintuc/:_id', async(req, res) => {
    const _id = req.params._id;
    TinTucModel.deleteOne({
        _id: _id
    }).then(data => {
        if (data.deletedCount === 0){
             res.json('Tin tức này không tồn tại!');
        }
        else{
            res.json('Xóa tin tức thành công!');
        }
    }).catch(err => {
        res.json({message: error});
    })
})


// Hàm xóa nhiều đối tượng 
route.post('/tintuc/xoanhieutintuc', async(req, res) => {
    const arrtintuc = req.body;
    let length = arrtintuc.length;
    for (let i = 0; i < length; i++){
        TinTucModel.deleteOne({
        _id: arrtintuc[i]
        }).then(data => {
        if (data.deletedCount === 0){
             res.json('Tin tức này không tồn tại!');
        }
        else{
            res.json('Xóa tin tức thành công!');
        }
        }).catch(err => {
        res.json({message: err});
        })
    }    
})
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;