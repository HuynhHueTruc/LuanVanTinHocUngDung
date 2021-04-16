const { Schema } = require('mongoose');
const mongoose = require('mongoose')

let KhuyenMaiSchema = new mongoose.Schema({
   _id: mongoose.Schema.ObjectId,
   Ten_khuyen_mai: String, 
   Gia_tri: Number,
   Ngay_bat_dau: Date,
   Ngay_ket_thuc: Date, 
   Danh_muc_nho: [{
    DMN_id: mongoose.Schema.ObjectId
   }],
   Thoi_gian_tao: Date,
   Thoi_gian_cap_nhat: Date
});

const KhuyenMaiModel = mongoose.model('khuyen_mais', KhuyenMaiSchema);
module.exports = KhuyenMaiModel;
