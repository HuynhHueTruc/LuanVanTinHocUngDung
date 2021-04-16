export class HoaDonNhapHang{
  constructor(
    public id: string,
    public IDNhanVien: string,
    public SanPham: [
      SanPham_id: string,
      SoLuong: number,
      GiaNhap: number
    ],
    public ChuThich: string,
    public TongTien: number,
    public NgayNhap: Date
  ) {}
}
