export class KhachHangModel{

    public Khach_hang_id: string;
    public Ho_ten: string;
    public Dia_chi: {
      Xa_Phuong: string,
      Huyen_Quan: string,
      Tinh_ThanhPho: string
    };
    public Gioi_tinh: string;
    public So_dien_thoai: string;
    // public Ma_OTP: string;
    public Mat_khau: string;
    public Email: string;
    // public Tich_diem: number;
    // public Thoi_gian_tao: Date;
}
