export class HoaDonBanHangModel {
  NhanVien_id: string;
  San_Pham: [{
    SanPham_id: string,
    So_luong: number,
    Gia_ban: number
  }];
  KhachHang_id: string;
  Ho_ten: string;
  So_dien_thoai: string;
  Dia_chi: [{
    Xa_Phuong: string,
    Huyen_Quan: string,
    Tinh_ThanhPho: string
  }];
  VanChuyen_id: string;
  ThanhToan_id: string;
  Tong_tien: number;
  Ngay_cap_nhat: Date;
}
