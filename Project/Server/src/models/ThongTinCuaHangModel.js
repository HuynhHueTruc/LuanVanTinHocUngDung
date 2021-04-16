//const { Schema } = require('mongoose');
const { ObjectId } = require('bson');
const mongoose = require('mongoose')
//Tạo ra 1 khung schema dành cho đối tượng DanhMuc trên server khi trả về 
// Các đối tượng phải giống như trong mongoDB
let CuaHangSchema = new mongoose.Schema({
    _id: ObjectId,
    Ten_cua_hang: String,
    Dia_chi: [{
        Xa_Phuong: String,
        Huyen_Quan: String,
        Tinh_ThanhPho: String
    }],
    So_dien_thoai: String,
    Banner: [{
        Hinh_anh: String,
        Mo_ta: String,
    }],
    Anh_dai_dien: String,
    Gioi_thieu: String
});
const CuaHangModel = mongoose.model('thong_tin_cua_hangs', CuaHangSchema);

//Export ra bảng với tên danh_mucs
module.exports = CuaHangModel