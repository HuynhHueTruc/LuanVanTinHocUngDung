const express = require('express')
const mongoose = require('mongoose')
//Khai báo biến chứa các hỗ trợ từ express
const route = express()
var dateFormat = require('dateformat'); 
var now = new Date();
dateFormat(now, "dddd, mmmm dS, yyyy, h:MM:ss TT");

const { ObjectID } = require('bson');

const DanhMucModel = require('../src/models/DanhMucModel.js')


// Tạo API lấy dữ liệu từ MongoDB về
route.get('/danhmuc', async(req, res) => {
    DanhMucModel.find({}).select({
        Ten_danh_muc: 1,
        Loai_cay: 1,
        Danh_muc_nho: [{ 
            Ten_danh_muc_nho: 1 ,
            Loai_cay: 1,
            DMN_id: 1
        }],
        Thoi_gian_tao: 1,
        Thoi_gian_cap_nhat: 1
    }).exec((err, danhmucs) => {
        if (err) {
            res.json({
                result: "failed",
                data: [],
                message: `Error is: ${err}`
            })
        } else {

            //Trả về dạng JSON
            res.json({danhmucs})
        }
    })
})


// Hàm cập nhật
route.put('/danhmuc/capnhatdanhmucnho/:_id', async(req, res) => {
    const _id = req.params._id;
    const {Ten_danh_muc, Danh_muc_nho} = req.body;
    for (const i in Danh_muc_nho){
        if (Danh_muc_nho[i].DMN_id === ''){
            Danh_muc_nho[i].DMN_id =  new ObjectID()
        }
    }
    const Thoi_gian_cap_nhat = dateFormat();
    console.log(Danh_muc_nho)
    DanhMucModel.findOne({
        _id: _id
    }).then(data => {
           DanhMucModel.updateOne({
                _id: _id
            }, {
                Ten_danh_muc: Ten_danh_muc,
                Danh_muc_nho: Danh_muc_nho,
                Thoi_gian_cap_nhat : Thoi_gian_cap_nhat,
              
                }).then(dt => {
                    console.log(dt)
                })
               
    }).then(data => {
        res.json('Cập nhật danh mục thành công!')
    }).catch(err => {
        res.json('Không tìm thấy danh mục này!')

    })
})
//Export biến route để server.js có thể gọi các api được viết
module.exports = route;