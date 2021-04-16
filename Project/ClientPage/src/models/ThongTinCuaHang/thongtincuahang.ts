export class ThongTinCuaHangModel{
    id: string;
    Ten_cua_hang: string;
    Dia_chi: {
      Xa_Phuong: string,
      Quan_Huyen: string,
      Tinh_ThanhPho: string
    };
    SDT: string;
    Banner: {
      Hinh_anh: string,
      Mo_ta: string,
    };
    Anh_dai_dien: string;
}
