const mongoose = require('mongoose')

let GioHangSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    San_Pham: [{
        SanPham_id: String,
        So_luong: Number,
    }],
    KhachHang_id: String,
    Thoi_gian_cap_nhat: Date
});

const GioHangModel = mongoose.model('gio_hangs', GioHangSchema);

module.exports = GioHangModel