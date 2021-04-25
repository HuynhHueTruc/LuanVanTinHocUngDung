export class SanPhamModel{
  _id: string;
  Ten_san_pham: string;
  So_luong: number;
  Danh_Muc: [{
      DMN_id: string
  }];
  Gia: number;
  Hinh_anh: string;
  Mo_ta: string;
  Bao_hanh: string;
  Danh_gia: [{
      KhachHang_id: string,
      Noi_dung: string,
      So_diem: number,
      Ngay_danh_gia: Date,
      Ngay_cap_nhat: Date
  }];
}
