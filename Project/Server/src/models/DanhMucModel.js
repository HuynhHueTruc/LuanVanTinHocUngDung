//const { Schema } = require('mongoose');
const mongoose = require('mongoose')
//Tạo ra 1 khung schema dành cho đối tượng DanhMuc trên server khi trả về 
// Các đối tượng phải giống như trong mongoDB
let DanhMucSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    Ten_danh_muc: String,
    Loai_cay: String,
    Danh_muc_nho: [{
        DMN_id: String,
        Loai_cay: String, 
        Ten_danh_muc_nho: String
    }], 
    Thoi_gian_tao: Date,
    Thoi_gian_cap_nhat: Date
});
const DanhMucModel = mongoose.model('danh_mucs', DanhMucSchema);

//Export ra bảng với tên danh_mucs
module.exports = DanhMucModel