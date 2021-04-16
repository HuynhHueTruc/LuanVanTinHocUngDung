const express = require('express')
var mongoose = require('mongoose');
const route = express()
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");
const { ObjectID } = require('bson');
const PhuongThucThanhToanModel = require('../src/models/PhuongThucThanhToanModel')

// Tạo API lấy dữ liệu từ MongoDB về
route.get('/phuongthucthanhtoan/thongtin', async(req, res) => {
    PhuongThucThanhToanModel.find({}).select({
        _id: 1,
        Ten_phuong_thuc: 1,
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, phuongthucthanhtoans) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {
            //Trả về dạng JSON
            res.json({phuongthucthanhtoans})
        }
    })
})

route.post('/phuongthucthanhtoan/taomoi', async(req, res) => {
    var _id = new ObjectID()
    var Ten_phuong_thuc = req.body.Ten_phuong_thuc;
    var Thoi_gian_cap_nhat = dateFormat();
    var Thoi_gian_tao = dateFormat();
// Kiểm tra m có tồn tại chưa
PhuongThucThanhToanModel.findOne({
    Ten_phuong_thuc: Ten_phuong_thuc
})
.then(data =>{
    if(data){ //Nếu tồn tại thì thông báo đã tồn tại mã này rồi
        res.json('Phương thức thanh toán này đã tồn tại!');
    }else{
        // Kiểm tra email đã tồn tại chưa
       return PhuongThucThanhToanModel.create({
            _id: _id,
            Ten_phuong_thuc: Ten_phuong_thuc,
            Thoi_gian_tao: Thoi_gian_tao,
            Thoi_gian_cap_nhat: Thoi_gian_cap_nhat
        }).then(dt => {
            res.json('Tạo phương thức thanh toán thành công!')
        })

    }
})

.catch (err =>{
    res.json(err)
})
})

// Hàm cập nhật
route.put('/phuongthucthanhtoan/capnhatphuongthucthanhtoan/:_id', async(req, res) => {
    // console.log(req.body)
    const _id = req.params._id;
    const {Ten_phuong_thuc} = req.body;
    const Thoi_gian_cap_nhat = dateFormat();
  
    PhuongThucThanhToanModel.findOne({
        _id: _id
    }).then(data => {
          return PhuongThucThanhToanModel.updateOne({
                _id: _id
            }, {
                Ten_phuong_thuc: Ten_phuong_thuc,
                Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
                }).then(data => {
                    res.json('Cập nhật phương thức thanh toán thành công!')
                })
               
    }).catch(err => {
        res.json('Không tìm thấy phương thức thanh toán này!')

    })
})

// Hàm xóa một đối tượng 
route.delete('/phuongthucthanhtoan/xoaphuongthucthanhtoan/:_id', async(req, res) => {
    const _id = req.params._id;
    PhuongThucThanhToanModel.deleteOne({
        _id: _id
    }).then(data => {
        if (data.deletedCount === 0){
             res.json('Phương thức thanh toán này không tồn tại!');
        }
        else{
            res.json('Xóa phương thức thanh toán thành công!');
        }
    }).catch(err => {
        res.json({message: error});
    })
})


// Hàm xóa nhiều đối tượng 
route.post('/phuongthucthanhtoan/xoanhieuphuongthucthanhtoan', async(req, res) => {
    const arrPhuongThuc = req.body;
    let length = arrPhuongThuc.length;
    for (let i = 0; i < length; i++){
        PhuongThucThanhToanModel.deleteOne({
        _id: arrPhuongThuc[i]
        }).then(data => {
        if (data.deletedCount === 0){
             res.json('Phương thức thanh toán này không tồn tại!');
        }
        else{
            res.json('Xóa phương thức thanh toán thành công!');
        }
        }).catch(err => {
        res.json({message: err});
        })
    }    
})
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;