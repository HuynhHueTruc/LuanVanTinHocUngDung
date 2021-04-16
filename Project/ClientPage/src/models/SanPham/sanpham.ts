export class SanPham{
  constructor(
    public id: string,
    public TenSanPham: string,
    public DanhMuc: [
      DML_id: string,
      DMN_id: string
    ],
    public Gia: number,
    public SoLuong: number,
    public HinhAnh: string,
    public MoTa: string,
    public BaoHanh: string,
    public DanhGia: [
      KhachHang_id: string,
      NoiDung: string,
      SoDiem: number,
      NgayDanhGia: Date,
      NgayCapNhat: Date
    ]
  ){}
}
