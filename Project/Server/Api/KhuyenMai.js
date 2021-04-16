const express = require('express')
var mongoose = require('mongoose');
const route = express()
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

const { ObjectID } = require('bson');
const KhuyenMaiModel = require('../src/models/KhuyenMaiModel');

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/khuyenmai/thongtin', async(req, res) => {
    KhuyenMaiModel.find({}).select({
        _id: 1,
        Ten_khuyen_mai: 1, 
        Gia_tri: 1,
        Ngay_bat_dau: 1, 
        Ngay_ket_thuc: 1,
        Danh_muc_nho: [{
            DMN_id: 1
        }], 
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, khuyenmais) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({khuyenmais})
        }
    })
})


route.post('/khuyenmai/taomoi', async(req, res) => {
    var _id = new ObjectID()
    var Ten_khuyen_mai = req.body.Ten_khuyen_mai;
    var Gia_tri = req.body.Gia_tri;
    var Danh_muc_nho = req.body.Danh_muc_nho;
    var Ngay_bat_dau = req.body.Ngay_bat_dau;
    var Ngay_ket_thuc = req.body.Ngay_ket_thuc;
    var Thoi_gian_cap_nhat = dateFormat();
    var Thoi_gian_tao = dateFormat();
// Kiểm tra m có tồn tại chưa
KhuyenMaiModel.findOne({
    Ten_khuyen_mai: Ten_khuyen_mai
})
.then(data =>{
    if(data){ //Nếu tồn tại thì thông báo đã tồn tại mã này rồi
        res.json('Khuyến mãi này đã tồn tại!');
    }else{
        // Kiểm tra email đã tồn tại chưa
       return KhuyenMaiModel.create({
            _id: _id,
            Ten_khuyen_mai: Ten_khuyen_mai,
            Gia_tri: Gia_tri,
            Danh_muc_nho: Danh_muc_nho,
            Ngay_bat_dau: Ngay_bat_dau,
            Ngay_ket_thuc: Ngay_ket_thuc,
            Thoi_gian_tao: Thoi_gian_tao,
            Thoi_gian_cap_nhat: Thoi_gian_cap_nhat
        })

    }
})
.then(dt => {
    res.json('Tạo khuyến mãi thành công!')
})
.catch (err =>{
    res.json(err)
})
})

// Hàm cập nhật
route.put('/khuyenmai/capnhatkhuyenmai/:_id', async(req, res) => {
    // console.log(req.body)
    const _id = req.params._id;
    const {Ten_khuyen_mai, Gia_tri, Danh_muc_nho, Ngay_bat_dau, Ngay_ket_thuc} = req.body;
    const Thoi_gian_cap_nhat = dateFormat();
  
    KhuyenMaiModel.findOne({
        _id: _id
    }).then(data => {
          return KhuyenMaiModel.updateOne({
                _id: _id
            }, {
                Ten_khuyen_mai: Ten_khuyen_mai,
                Gia_tri: Gia_tri,
                Danh_muc_nho: Danh_muc_nho,
                Ngay_bat_dau: Ngay_bat_dau,
                Ngay_ket_thuc: Ngay_ket_thuc,
                Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                })
               
    }).then(data => {
        res.json('Cập nhật khuyến mãi thành công!')
    }).catch(err => {
        res.json('Không tìm thấy khuyến mãi này!')

    })
})

// Hàm xóa một đối tượng 
route.delete('/khuyenmai/xoakhuyenmai/:_id', async(req, res) => {
    const _id = req.params._id;
    KhuyenMaiModel.deleteOne({
        _id: _id
    }).then(data => {
        if (data.deletedCount === 0){
             res.json('Khuyến mãi này không tồn tại!');
        }
        else{
            res.json('Xóa khuyến mãi thành công!');
        }
    }).catch(err => {
        res.json({message: error});
    })
})


// Hàm xóa nhiều đối tượng 
route.post('/khuyenmai/xoanhieukhuyenmai', async(req, res) => {
    const arrKhuyenMai = req.body;
    let length = arrKhuyenMai.length;
    for (let i = 0; i < length; i++){
        KhuyenMaiModel.deleteOne({
        _id: arrKhuyenMai[i]
        }).then(data => {
        if (data.deletedCount === 0){
             res.json('Khuyến mãi này không tồn tại!');
        }
        else{
            res.json('Xóa khuyến mãi thành công!');
        }
        }).catch(err => {
        res.json({message: err});
        })
    }    
})
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;