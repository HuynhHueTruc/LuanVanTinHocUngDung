const express = require('express')
var mongoose = require('mongoose');
const route = express()
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

const HinhThucVanChuyenModel = require('../src/models/HinhThucVanChuyenModel');
const { ObjectID } = require('bson');

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/hinhthucvanchuyen/thongtin', async(req, res) => {
    HinhThucVanChuyenModel.find({}).select({
        _id: 1,
        Ten_hinh_thuc: 1,
        Gia: 1,
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, hinhthucvanchuyens) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({hinhthucvanchuyens})
        }
    })
})


route.post('/hinhthucvanchuyen/taomoi', async(req, res) => {
    var _id = new ObjectID()
    var Ten_hinh_thuc = req.body.Ten_hinh_thuc;
    var Gia = req.body.Gia;
    var Thoi_gian_cap_nhat = dateFormat();
    var Thoi_gian_tao = dateFormat();
// Kiểm tra m có tồn tại chưa
HinhThucVanChuyenModel.findOne({
    Ten_hinh_thuc: Ten_hinh_thuc
})
.then(data =>{
    if(data){ //Nếu tồn tại thì thông báo đã tồn tại mã này rồi
        res.json('Hình thức vận chuyển này đã tồn tại!');
    }else{
        // Kiểm tra email đã tồn tại chưa
       return HinhThucVanChuyenModel.create({
            _id: _id,
            Ten_hinh_thuc: Ten_hinh_thuc,
            Gia: Gia,
            Thoi_gian_tao: Thoi_gian_tao,
            Thoi_gian_cap_nhat: Thoi_gian_cap_nhat
        }).then(dt => {
            res.json('Tạo hình thức vận chuyển thành công!')
        })

    }
})

.catch (err =>{
    res.json(err)
})
})

// Hàm cập nhật
route.put('/hinhthucvanchuyen/capnhathinhthucvanchuyen/:_id', async(req, res) => {
    const _id = req.params._id;
    const {Ten_hinh_thuc, Gia} = req.body;
    const Thoi_gian_cap_nhat = dateFormat();
  
    HinhThucVanChuyenModel.findOne({
        _id: _id
    }).then(data => {
          return HinhThucVanChuyenModel.updateOne({
                _id: _id
            }, {
                Ten_hinh_thuc: Ten_hinh_thuc,
                Gia: Gia,
                Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                }).then(data => {
                    res.json('Cập nhật hình thức vận chuyển thành công!')
                })
               
    }).catch(err => {
        res.json('Không tìm thấy hình thức vận chuyển này!')

    })
})

// Hàm xóa một đối tượng 
route.delete('/hinhthucvanchuyen/xoahinhthucvanchuyen/:_id', async(req, res) => {
    const _id = req.params._id;
    HinhThucVanChuyenModel.deleteOne({
        _id: _id
    }).then(data => {
        if (data.deletedCount === 0){
             res.json('Hình thức vận chuyển này không tồn tại!');
        }
        else{
            res.json('Xóa hình thức vận chuyển thành công!');
        }
    }).catch(err => {
        res.json({message: error});
    })
})


// Hàm xóa nhiều đối tượng 
route.post('/hinhthucvanchuyen/xoanhieuhinhthucvanchuyen', async(req, res) => {
    const arrHinhThuc = req.body;
    let length = arrHinhThuc.length;
    for (let i = 0; i < length; i++){
        HinhThucVanChuyenModel.deleteOne({
        _id: arrHinhThuc[i]
        }).then(data => {
        if (data.deletedCount === 0){
             res.json('Hình thức vận chuyển này không tồn tại!');
        }
        else{
            res.json('Xóa hình thức vận chuyển thành công!');
        }
        }).catch(err => {
        res.json({message: err});
        })
    }    
})
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;