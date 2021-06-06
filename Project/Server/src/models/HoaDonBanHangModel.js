const { Schema } = require('mongoose');
const mongoose = require('mongoose')

let HoaDonBanHangSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    NhanVien_id: String,
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
    VanChuyen_id: String,
    ThanhToan_id: String,
    Tong_tien: Number,
    Ngay_cap_nhat: Date
});

const HoaDonBanHangModel = mongoose.model('hoa_don_ban_hangs', HoaDonBanHangSchema);
module.exports = HoaDonBanHangModel;