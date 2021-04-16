export class NhaCungCapModel{
  _id: string;
  Ten: string;
  Dia_chi: {
      Tinh_ThanhPho: string,
      Huyen_Quan: string,
      Xa_Phuong: string
  };
  Email: string;
  So_dien_thoai: string;
  Danh_muc_cung_cap: [
      {
          DMN_id: string
      }
  ];
  Thoi_gian_tao: Date;
  Thoi_gian_chinh_sua: Date
}
