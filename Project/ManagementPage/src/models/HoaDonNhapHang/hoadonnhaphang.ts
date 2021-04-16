export class HoaDonNhapHangModel{
  _id: string;
  NhanVien_id: string;
  San_Pham: [{
      SanPham_id: string,
      So_luong: number,
      Gia_nhap: number
  }];
  Chu_thich: string;
  Tong_tien: string;
  Ngay_nhap: Date
}
