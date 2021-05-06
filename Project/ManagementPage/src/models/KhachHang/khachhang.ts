export class KhachHangModel{

     Khach_hang_id: string;
     Ho_ten: string;
     Ngay_sinh: Date;
     Dia_chi: {
      Xa_Phuong: string,
      Huyen_Quan: string,
      Tinh_ThanhPho: string
    };
     Gioi_tinh: string;
     CMND_CCCD: string;
     So_dien_thoai: string;
     Ma_so: string;
     So_thich: [{
       Loai_cay: string
     }]
     Mat_khau: string;
     Email: string;
     Tich_diem: number;
     Thoi_gian_tao: Date;
     Thoi_gian_cap_nhat: Date;
}
