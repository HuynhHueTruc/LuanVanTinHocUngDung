export class KhachHangModel{

    public Khach_hang_id: string;
    public Ho_ten: string;
    public Ngay_sinh: Date;
    public Dia_chi: {
      Xa_Phuong: string,
      Huyen_Quan: string,
      Tinh_ThanhPho: string
    };
    public Gioi_tinh: string;
    public CMND_CCCD: string;
    public So_dien_thoai: string;
    public Ma_so: string;
    public Mat_khau: string;
    public Email: string;
    public Tich_diem: number;
    public Thoi_gian_tao: Date;
    public Thoi_gian_cap_nhat: Date;
}
