const { ObjectId } = require('bson');
const { Schema } = require('mongoose');
const mongoose = require('mongoose')

let HinhThucVanChuyenSchema = new mongoose.Schema({
    _id: mongoose.Schema.ObjectId,
    Ten_hinh_thuc: String,
    Gia: Number,
    Thoi_gian_tao: Date,
    Thoi_gian_cap_nhat: Date
});

const HinhThucVanChuyenModel = mongoose.model('hinh_thuc_van_chuyens', HinhThucVanChuyenSchema);
module.exports = HinhThucVanChuyenModel;