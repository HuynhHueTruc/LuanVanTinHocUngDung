const { Schema } = require('mongoose');
const mongoose = require('mongoose')

let PhieuDatSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    San_Pham: [{
        SanPham_id: String,
        So_luong: Number,
        Gia_ban: Number
    }],
    KhachHang_id: String,
    Ho_ten: String,
    So_dien_thoai: String,
    Dia_chi: [{
        Xa_Phuong: String,
        Huyen_Quan: String,
        Tinh_ThanhPho: String
    }],
    VanChuyen_id: mongoose.Schema.ObjectId,
    ThanhToan_id: mongoose.Schema.ObjectId,
    Tong_tien: Number,
    Ngay_nhan: Date,
    Ngay_cap_nhat: Date,
    Trang_thai: String
});

const PhieuDatModel = mongoose.model('phieu_dats', PhieuDatSchema);
module.exports = PhieuDatModel;