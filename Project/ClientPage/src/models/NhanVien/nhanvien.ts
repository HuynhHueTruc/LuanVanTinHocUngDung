export class NhanVien{
  constructor(
    public id: string,
    public HoTen: string,
    public DiaChi: [
      Xa_Phuong: string,
      Quan_Huyen: string,
      Tinh_ThanhPho: string
    ],
    public GioiTinh: string,
    public SDT: number,
    public Email: string,
    public CMND_CCCD: string,
    public QuyenSuDung: string,
    public MaOTP: string,
    public MatKhau: string,
    public ThoiGianTao: Date,
    public ThoiGianCapNhat: Date
  ){}
}
