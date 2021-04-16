export class QuanHuyenModel{
  name: string;
  code: Int32Array;
  codename: string;
  division_type: string;
  short_codename: string;
  wards: {
    name: string,
    code: Int32Array,
    codename: string,
    division_type: string,
    short_codename: string
  };
}
