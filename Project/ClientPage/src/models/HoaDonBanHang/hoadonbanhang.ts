export class HoaDonBanHang{
  constructor(
    public id: string,
    public SanPham: [
      SanPham_id: string,
      SoLuong: number,
      GiaBan: number
    ],
    public IDKhachHang: string,
    public HoTen: string,
    public SDT: string,
    public DiaChi: [
      Xa_Phuong: string,
      Quan_Huyen: string,
      Tinh_ThanhPho: string
    ],
    public VAT: string,
    public IDVanChuyen: string,
    public IDThanhToan: string,
    public TongTien: number,
    public NgayLap: Date
  ){}
}
