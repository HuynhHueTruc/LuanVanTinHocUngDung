export class DanhMucModel{
    _id: string;
    Ten_danh_muc: string;
    Danh_muc_nho: [{
      DMN_id: string;
      Loai_cay: string;
      Ten_danh_muc_nho: string
    }];
    Thoi_gian_tao: Date;
    THoi_gian_cap_nhat: Date
}
