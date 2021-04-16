export class NhaCungCap{
  constructor(
    public id: string,
    public TenNCC: string,
    public DiaChi: [
      Xa_Phuong: string,
      Quan_Huyen: string,
      Tinh_ThanhPho: string
    ],
    public Email: string,
    public SDT: number,
    public SanPhamCC: [
      SanPham_id: string
    ]
  ){}
}
