export class GioHang{
  constructor(
    public id: string,
    public SanPham: [
      SanPham_id: string,
      SoLuong: number,
      GiaBan: number
    ],
    public IDKhachHang: string,
    public TongTien: number
  ){}
}
