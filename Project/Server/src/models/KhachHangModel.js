const { Schema } = require('mongoose');
const mongoose = require('mongoose')

let KhachHangSchema = new mongoose.Schema({
    Khach_hang_id: String,
    Ho_ten: String,
    Ngay_sinh: Date,
    Dia_chi: [{
        Xa_Phuong: String,
        Huyen_Quan: String,
        Tinh_ThanhPho: String
    }],
    CMND_CCCD: String,
    Gioi_tinh: String,
    So_dien_thoai: String,
    Ma_so: String,
    Mat_khau: String,
    Email: String,
    Tich_diem: Number,
    Thoi_gian_tao: Date,
    Thoi_gian_cap_nhat: Date
});

const KhachHangModel = mongoose.model('khach_hangs', KhachHangSchema);
module.exports = KhachHangModel;