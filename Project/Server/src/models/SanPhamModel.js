const { Schema } = require('mongoose');
const mongoose = require('mongoose')

let SanPhamSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    Ten_san_pham: String,
    So_luong: Number,
    Danh_Muc: [{
        DMN_id: mongoose.Schema.ObjectId
    }],
    Gia: Number,
    Hinh_anh: String,
    Mo_ta: String,
    Danh_gia: [{
        KhachHang_id: String,
        Noi_dung: String,
        Hinh_anh: [{
            url: String
        }],
        So_diem: Number,
        Ngay_danh_gia: Date,
        Ngay_cap_nhat: Date
    }],
    Thoi_gian_tao: Date,
    Thoi_gian_cap_nhat: Date
});

const SanPhamModel = mongoose.model('san_phams', SanPhamSchema);

module.exports = SanPhamModel