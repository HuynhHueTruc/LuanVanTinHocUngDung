export class KhuyenMai{
  constructor(
    public id: string,
    public TenKhuyenMai: string,
    public GiaTri: number,
    public NgayBatDau: Date,
    public NgayKetThuc: Date,
    public SanPham: [
      SanPham_id: string
    ]
  ){}
}
