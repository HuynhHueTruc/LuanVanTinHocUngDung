export class DiaChiModel{
  name: string;
  code: Int32Array;
  codename: string;
  division_type: string;
  phone_code: Int32Array;
  districts: {
    name: string,
    code: Int32Array,
    codename: string,
    division_type: string,
    short_codename: string,
    wards: {
      name: string,
      code: Int32Array,
      codename: string,
      division_type: string,
      short_codename: string
    }
  };
}
