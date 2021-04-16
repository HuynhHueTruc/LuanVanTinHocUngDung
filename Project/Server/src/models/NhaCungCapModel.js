//const { Schema } = require('mongoose');
const mongoose = require('mongoose')
//Tạo ra 1 khung schema dành cho đối tượng DanhMuc trên server khi trả về 
// Các đối tượng phải giống như trong mongoDB
let NhaCungCapSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    Ten: String,
    Dia_chi: [{
        Tinh_ThanhPho: String,
        Huyen_Quan: String,
        Xa_Phuong: String
    }],
    Email: String,
    So_dien_thoai: String,
    Danh_muc_cung_cap: [
        {
            DMN_id: mongoose.Schema.ObjectId
        }
    ],
    Thoi_gian_tao: Date,
    Thoi_gian_cap_nhat: Date
});
const NhaCungCapModel = mongoose.model('nha_cung_caps', NhaCungCapSchema);

//Export ra bảng với tên danh_mucs
module.exports = NhaCungCapModel