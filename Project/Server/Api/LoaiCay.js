const express = require('express')
const mongoose = require('mongoose')
//Khai báo biến chứa các hỗ trợ từ express
const route = express()
const { ObjectID } = require('bson');
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

const LoaiCayModel = require('../src/models/LoaiCayModel')
// Tạo API lấy dữ liệu từ MongoDB về
route.get('/loaicay/thongtin', async(req, res) => {
    LoaiCayModel.find({}).select({
        _id: 1,
        Ten_loai_cay: 1,
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, loaicays) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({loaicays})
        }
    })
})

route.post('/loaicay/taomoi', async(req, res) => {
    var _id = new ObjectID()
    var Ten_loai_cay = req.body.Ten_loai_cay;
    var Thoi_gian_cap_nhat = dateFormat();
    var Thoi_gian_tao = dateFormat();
// Kiểm tra m có tồn tại chưa
LoaiCayModel.findOne({
    Ten_loai_cay: Ten_loai_cay
})
.then(data =>{
    if(data){ //Nếu tồn tại thì thông báo đã tồn tại mã này rồi
        res.json('Loại cây này đã tồn tại!');
    }else{
        // Kiểm tra email đã tồn tại chưa
       return LoaiCayModel.create({
            _id: _id,
            Ten_loai_cay: Ten_loai_cay,
            Thoi_gian_tao: Thoi_gian_tao,
            Thoi_gian_cap_nhat: Thoi_gian_cap_nhat
        })

    }
})
.then(dt => {
    res.json('Tạo loại cây thành công!')
})
.catch (err =>{
    res.json(err)
})
})

// Hàm cập nhật
route.put('/loaicay/capnhatloaicay/:_id', async(req, res) => {
    // console.log(req.body)
    const _id = req.params._id;
    const {Ten_loai_cay} = req.body;
    const Thoi_gian_cap_nhat = dateFormat();
  
    LoaiCayModel.findOne({
        _id: _id
    }).then(data => {
          return LoaiCayModel.updateOne({
                _id: _id
            }, {
                Ten_loai_cay: Ten_loai_cay,
                Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                })
               
    }).then(data => {
        res.json('Cập nhật loại cây thành công!')
    }).catch(err => {
        res.json('Không tìm thấy loại cây này!')

    })
})

// Hàm xóa một đối tượng 
route.delete('/loaicay/xoaloaicay/:_id', async(req, res) => {
    const _id = req.params._id;
    LoaiCayModel.deleteOne({
        _id: _id
    }).then(data => {
        if (data.deletedCount === 0){
             res.json('Loại cây này không tồn tại!');
        }
        else{
            res.json('Xóa loại cây thành công!');
        }
    }).catch(err => {
        res.json({message: error});
    })
})


// Hàm xóa nhiều đối tượng 
route.post('/loaicay/xoanhieuloaicay', async(req, res) => {
    const arrLoaiCay = req.body;
    let length = arrLoaiCay.length;
    for (let i = 0; i < length; i++){
        LoaiCayModel.deleteOne({
        _id: arrLoaiCay[i]
        }).then(data => {
        if (data.deletedCount === 0){
             res.json('Loại cây này không tồn tại!');
        }
        else{
            res.json('Xóa loại cây thành công!');
        }
        }).catch(err => {
        res.json({message: err});
        })
    }    
})
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;