//const { Schema } = require('mongoose');
const mongoose = require('mongoose')
//Tạo ra 1 khung schema dành cho đối tượng DanhMuc trên server khi trả về 
// Các đối tượng phải giống như trong mongoDB
let LoaiCaySchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    Ten_loai_cay: String,
    Hinh_anh: String,
    Thoi_gian_tao: Date,
    Thoi_gian_cap_nhat: Date
});
const LoaiCayModel = mongoose.model('loai_cays', LoaiCaySchema);

//Export ra bảng với tên danh_mucs
module.exports = LoaiCayModel