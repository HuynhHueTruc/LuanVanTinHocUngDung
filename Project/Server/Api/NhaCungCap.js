
const express = require('express')
var mongoose = require('mongoose');
const route = express()
var dateFormat = require('dateformat'); 
var now = new Date();
// Dùng cho phương thức posts
const nodemailer = require('nodemailer')
const details = require('../src/models/GmailModel')

dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
const { ObjectID } = require('bson');
const NhaCungCapModel = require('../src/models/NhaCungCapModel');

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/nhacungcap/thongtin', async(req, res) => {
    NhaCungCapModel.find({}).select({
        _id: 1,
        Ten: 1,
        Dia_chi: [{
            Tinh_ThanhPho: 1,
            Huyen_Quan: 1,
            Xa_Phuong: 1
        }],
        Email: 1,
        So_dien_thoai: 1,
        Danh_muc_cung_cap: [
            {
                DMN_id: 1
            }
        ],
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, nhacungcaps) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({nhacungcaps})
        }
    })
})



route.post('/nhacungcap/taomoi', async(req, res) => {
    var _id = new ObjectID()
    var Ten = req.body.Ten;
    var Dia_chi = req.body.Dia_chi;
    var Email = req.body.Email;
    var So_dien_thoai = req.body.So_dien_thoai;
    var Danh_muc_cung_cap = req.body.Danh_muc_cung_cap;
    var Thoi_gian_cap_nhat = dateFormat();
    var Thoi_gian_tao = dateFormat();
// Kiểm tra m có tồn tại chưa
NhaCungCapModel.findOne({
    _id: _id
})
.then(data =>{
    if(data){ //Nếu tồn tại thì thông báo đã tồn tại mã này rồi
        res.json('Nhà cung cấp này đã tồn tại!');
    }else{
        // Kiểm tra email đã tồn tại chưa
       return NhaCungCapModel.create({
            _id: _id,
            Ten: Ten,
            Dia_chi: Dia_chi,
            Email: Email,
            So_dien_thoai: So_dien_thoai,
            Danh_muc_cung_cap: Danh_muc_cung_cap,
            Thoi_gian_tao: Thoi_gian_tao,
            Thoi_gian_cap_nhat: Thoi_gian_cap_nhat
        })

    }
})
.then(dt => {
    res.json('Tạo nhà cung cấp thành công!')
})
.catch (err =>{
    res.json(err)
})
})

// Hàm cập nhật
route.put('/nhacungcap/capnhatnhacungcap/:_id', async(req, res) => {
    const _id = req.params._id;
    const {Ten, Dia_chi, Email, So_dien_thoai, Danh_muc_cung_cap} = req.body;
    const Thoi_gian_cap_nhat = dateFormat();
  
    NhaCungCapModel.findOne({
        _id: _id
    }).then(data => {
          return NhaCungCapModel.updateOne({
                _id: _id
            }, {
                Ten: Ten,
                Dia_chi: Dia_chi,
                Dia_chi: Dia_chi,
                Email: Email,
                So_dien_thoai: So_dien_thoai,
                Danh_muc_cung_cap: Danh_muc_cung_cap,
                Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                })
               
    }).then(data => {
        res.json('Cập nhật nhà cung cấp thành công!')
    }).catch(err => {
        res.json('Không tìm thấy nhà cung cấp này!')

    })
})

// Hàm xóa một đối tượng 
route.delete('/nhacungcap/xoanhacungcap/:_id', async(req, res) => {
    const _id = req.params._id;
    NhaCungCapModel.deleteOne({
        _id: _id
    }).then(data => {
        if (data.deletedCount === 0){
             res.json('Nhà cung cấp này không tồn tại!');
        }
        else{
            res.json('Xóa nhà cung cấp thành công!');
        }
    }).catch(err => {
        res.json({message: error});
    })
})


// Hàm xóa nhiều đối tượng 
route.post('/nhacungcap/xoanhacungcap', async(req, res) => {
    const arrNhaCungCap = req.body;
    let length = arrNhaCungCap.length;
    for (let i = 0; i < length; i++){
        NhaCungCapModel.deleteOne({
        _id: arrNhaCungCap[i]
        }).then(data => {
        if (data.deletedCount === 0){
             res.json('Nhà cung cấp này không tồn tại!');
        }
        else{
            res.json('Xóa nhà cung cấp thành công!');
        }
        }).catch(err => {
        res.json({message: err});
        })
    }    
})


// Hàm gửi email theo nội dung tự tạo
route.post('/nhacungcap/guiemail', async(req, res) => {
    const arrThongTin = req.body.thongtinemail;
    const noi_dung = req.body.noidung;
    const chu_de = req.body.chude;
    let length = arrThongTin.length;

    sendMail(arrThongTin, noi_dung, chu_de, info => {
        console.log(`Email đã được gửi!`)
        // res.json(info)
    }).then(data =>{
        res.json(data)
    }).catch(err =>{
        res.json(err)
    })
})

async function sendMail(arrThongTin, noi_dung, chu_de, callback){
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", //pop.gmail.com, port 110
        port: 587, //143, 587, 25
        secure: false,
        auth: {
            user: details.Tai_khoan,
            pass: details.Mat_khau
        }
    })
    for (let i = 0; i < arrThongTin.length; i++) {
        let mailOption = {
            from: '"GreenLife Shop"',
            to: arrThongTin[i].Email,
            subject: chu_de,
            html: ` <h5>Xin chào ${arrThongTin[i].Ho_ten}</h5>
            ${noi_dung}`
        }   
        let info = await transporter.sendMail(mailOption);
        callback(info);   
    }
}
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;