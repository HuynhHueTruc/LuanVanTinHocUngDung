import { SanPhamNhapModel } from './../../../models/HoaDonNhapHang/sanphamnhap';
import { Component, OnInit } from '@angular/core';
import { NhanVienModel } from './../../../models/NhanVien/nhanvien';
import { NhanvienService } from './../../../services/NhanVien/nhanvien.service';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { HoadonnhaphangService } from './../../../services/HoaDonNhapHang/hoadonnhaphang.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HoaDonNhapHangModel } from './../../../models/HoaDonNhapHang/hoadonnhaphang';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

  hoadon: HoaDonNhapHangModel
  taikhoan: any
  thongtinsanpham = []
  arrSanPham: SanPhamModel[] = [];
  arrNhanVien: NhanVienModel[] = [];

  dssanpham: SanPhamModel
  sanphams: SanPhamModel
  dsSP: SanPhamNhapModel
  // Mảng lưu danh sách sản phẩm được thêm vào hóa đơn
  lstsanpham: SanPhamNhapModel[] = []
  dsnhanvien: NhanVienModel
  dshoadonnhap: HoaDonNhapHangModel[] = []
  dshoadonsearch: HoaDonNhapHangModel[] = []
  keyword: string;
  dropdownSettings: IDropdownSettings;

  sanphamtmp: SanPhamModel

  So_luong = 0
  Gia_nhap = 0
  // Biến tính tổng tiền
  sum = 0
  // Lưu chỉ số của đối tượng được cập nhật để so sánh có trùng hay không
  flag: string
  constructor(private modalService: NgbModal, private hoadonnhapService: HoadonnhaphangService, private sanphamService: SanphamService, private nhanvienService: NhanvienService) { }

  ngOnInit(): void {

    this.getdshoadon()
    this.dropdownSettings = {
      singleSelection: true,
      idField: '_id',
      textField: 'Ten_san_pham',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  // Lấy thông tin tài khoản hiện đang thao tác
  getthongtintaikhoan() {
    this.taikhoan = JSON.parse(localStorage.getItem('loggedInAcount'));
  }

  getdshoadon() {
    this.hoadonnhapService.getListHoaDonNhapHang().subscribe((res: any) => {

      this.hoadon = res.hoadonnhaphangs;
      this.dshoadonnhap = res.hoadonnhaphangs;
      // hỗ trợ searchbykeywword và searchbysex
      this.dshoadonsearch = res.hoadonnhaphangs;

      this.getdsSanPham(this.dshoadonnhap)
    })
  }

  // Lấy thông tin sản phẩm
  getdsSanPham(dshoadon) {
    try {
      this.sanphamService.getListSanPham().subscribe((res: any) => {
        this.dssanpham = res.sanphams;
        this.compareSanPham_id(dshoadon)
      })
    } catch (error) {
      alert(error)
    }
  }

  // Tìm đối tượng so khớp
  compareSanPham_id(dshoadon) {
    this.arrSanPham = []
    this.thongtinsanpham.splice(0, this.thongtinsanpham.length)
    for (const dmn in dshoadon) {
      for (const dmn2 in dshoadon[dmn].San_Pham) {
        for (const sp in this.dssanpham) {
          if (dshoadon[dmn].San_Pham[dmn2].SanPham_id === this.dssanpham[sp]._id) {
            this.arrSanPham.push(this.dssanpham[sp])
          }
        }
      }
      this.thongtinsanpham.push(this.arrSanPham)
      this.arrSanPham = [];
    }
  }

  // Hàm chuyển đổi tiếng Việt sang tiếng Anh
  removeAccents(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      ;
  }


  // Hàm tìm kiếm theo tên hoặc id
  SearchByKeyWord() {
    this.dshoadonnhap = this.dshoadonsearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdshoadon();
    } else {
      this.dshoadonnhap = this.dshoadonnhap.filter(res => {
        // Cần xem lại, nếu nhập tên nhân viên thì sẽ gợi ý
        const nhanvien = this.removeAccents(res.NhanVien_id);
        const maso = this.removeAccents(res._id);
        const tmp2 = text.replace(/·/g, '');
        if (nhanvien.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return nhanvien.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        } else {
          if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
            return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
          }
        }
      });
    }
  }

  SearchByOption(value) {
    this.dshoadonnhap = this.dshoadonsearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'Cũ nhất') {
      this.thongtinsanpham = []
      this.getdshoadon();
    } else {
      if (target === 'Mới nhất') {
        this.dshoadonnhap.reverse();
        this.thongtinsanpham.reverse()
      }
    }
  }

   // Đóng dialog
   DongModal() {
    this.modalService.dismissAll();
    location.reload();
  }

  // Hàm mở Dialog Tạo tài khoản
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.hoadon = new HoaDonNhapHangModel();
    this.hoadon.San_Pham = [{ SanPham_id: '', So_luong: 0, Gia_nhap: 0 }]
  }

  // Hàm mở dialog thêm sản phẩm
  open_product_plus(content_product_plus){
    this.So_luong = 0
    this.Gia_nhap = 0;
      this.sanphamtmp = new SanPhamModel()
      this.dsSP = new SanPhamNhapModel()
      this.modalService.open(content_product_plus,  { ariaLabelledBy: 'modal-basic-title-product-plus', backdrop: 'static', keyboard: false })
  }

  open_product_update(content_product_update, sp, index){
    console.log(this.sanphamtmp)
    this.flag = index
    this.sanphamtmp[0].Ten_san_pham = sp.Ten_san_pham
    this.sanphamtmp[0]._id = sp.SanPham_id
    this.So_luong = sp.So_luong
    this.Gia_nhap = sp.Gia_nhap
    this.modalService.open(content_product_update,  { ariaLabelledBy: 'modal-basic-title-product-plus', backdrop: 'static', keyboard: false })
    this.ErrMessage()
  }

  ErrMessage(){
    if (this.sanphamtmp[0] === undefined){
      document.getElementById('errSanPham').style.display = 'block'
    }else{
      document.getElementById('errSanPham').style.display = 'none'
    }

    if (this.So_luong <= 0){
      document.getElementById('errSoLuong').style.display = 'block'
    }else{
      document.getElementById('errSoLuong').style.display = 'none'
    }

    if (this.Gia_nhap <= 0){
      document.getElementById('errGiaNhap').style.display = 'block'
    }else{
      document.getElementById('errGiaNhap').style.display = 'none'

    }
  }

// Thêm hóa đơn
ThemHoaDon(){
  this.getthongtintaikhoan()
  this.hoadon.NhanVien_id = this.taikhoan.Nhan_vien_id
  for(const i in this.lstsanpham){
    this.hoadon.San_Pham.push({SanPham_id: this.lstsanpham[i].SanPham_id, So_luong: this.lstsanpham[i].So_luong, Gia_nhap: this.lstsanpham[i].Gia_nhap})
  }
 this.hoadon.San_Pham.splice(0,1)
  if(this.hoadon.San_Pham[0].SanPham_id !== ''){
    for (const j in this.hoadon.San_Pham){
      if (this.hoadon.San_Pham[j].SanPham_id === ''){
        this.hoadon.San_Pham.splice(Number.parseInt(j), 1)
      }
    }
    this.hoadonnhapService.ThemHoaDonNhapHang(this.hoadon).subscribe(dt => {
      if (JSON.stringify(dt) === '"Tạo hóa đơn nhập hàng thành công!"') {
        this.CapNhatSoLuongSanPham()
        this.DongModal();
      }
      else {
        window.alert(dt);
        this.hoadon.San_Pham = [{ SanPham_id: '', So_luong: 0, Gia_nhap: 0 }]
        this.lstsanpham.splice(0, this.lstsanpham.length)
        this.modalService.dismissAll()

      }
    })
  }else {
    alert ('Vui lòng chọn sản phẩm!')
  }
}

 // Update số lượng Sản phẩm
 CapNhatSoLuongSanPham(){
  let so_luong;
  let arr_sp = [];
  this.sanphamService.getListSanPham().subscribe((res: any) =>{
    this.sanphams = res.sanphams
    for (const i in this.hoadon.San_Pham){
      for(const j in this.sanphams){
        if (this.hoadon.San_Pham[i].SanPham_id === this.sanphams[j]._id){
          so_luong = this.sanphams[j].So_luong + this.hoadon.San_Pham[i].So_luong
          this.sanphams[j].So_luong = so_luong
          arr_sp.push(this.sanphams[j])
        }
      }
    }
    this.sanphamService.CapNhatSoLuongSanPham(arr_sp).subscribe()

  })
}

 // Thêm sản phẩm vào list
ThemSanPham(content){
  if (this.sanphamtmp[0] === undefined || this.So_luong <= 0 || this.Gia_nhap <= 0){
    alert('Vui lòng nhập đầy đủ thông tin!')
  }else{
    if (this.KiemTraTrungSanPham(this.sanphamtmp)){
      for (const i in this.sanphamtmp){
        this.dsSP.SanPham_id = this.sanphamtmp[i]._id
        this.dsSP.Ten_san_pham = this.sanphamtmp[i].Ten_san_pham
        this.dsSP.Gia_nhap = this.Gia_nhap
        this.dsSP.So_luong = this.So_luong
      }
     this.lstsanpham.push(this.dsSP)
     this.sum = 0
    for (const i in this.lstsanpham){
      this.sum += this.lstsanpham[i].So_luong * this.lstsanpham[i].Gia_nhap
    }
     this.hoadon.Tong_tien =  this.sum.toString()
     this.dsSP = new SanPhamNhapModel()
     this.So_luong = 0
     this.Gia_nhap = 0
    this.modalService.dismissAll()
     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    }else {
      alert('Sản phẩm này đã được thêm vào danh sách!')
    }
  }
}

ChinhSuaSanPham(content){

  if (this.sanphamtmp[0] === undefined || this.So_luong <= 0 || this.Gia_nhap <= 0){
    alert('Vui lòng nhập đầy đủ thông tin!')
  }else{
// Lấy chỉ số sản phẩm trùng
  const index = this.SanPhamIndex(this.sanphamtmp)
  // = -1 là chưa có trong lstsanpham => có thể cập nhật
  if (index === -1){
    this.lstsanpham[Number.parseInt(this.flag)].Gia_nhap = this.Gia_nhap
    this.lstsanpham[Number.parseInt(this.flag)].So_luong = this.So_luong
    this.lstsanpham[Number.parseInt(this.flag)].Ten_san_pham = this.sanphamtmp[0].Ten_san_pham
    this.lstsanpham[Number.parseInt(this.flag)].SanPham_id = this.sanphamtmp[0]._id
  }
  else{
    // Kiểm tra nếu trùng tại vị trí đang cập nhật thì cho phép cập nhật
    if (index.toString() === this.flag.toString()){
      this.lstsanpham[Number.parseInt(this.flag)].Gia_nhap = this.Gia_nhap
      this.lstsanpham[Number.parseInt(this.flag)].So_luong = this.So_luong
      this.lstsanpham[Number.parseInt(this.flag)].Ten_san_pham = this.sanphamtmp[0].Ten_san_pham
      this.lstsanpham[Number.parseInt(this.flag)].SanPham_id = this.sanphamtmp[0]._id

    }else{
      // Nếu trùng ở document khác thì không cho cập nhật
      alert('Sản phẩm này đã có trong hóa đơn')

    }
  }

  this.sum = 0
  for (const i in this.lstsanpham){
    this.sum += this.lstsanpham[i].So_luong * this.lstsanpham[i].Gia_nhap
  }
  this.hoadon.Tong_tien =  this.sum.toString()

  this.modalService.dismissAll()
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
  }
}

Xoa(content, _id){
  for (const i in this.lstsanpham){
    if (this.lstsanpham[i].SanPham_id === _id){
      this.lstsanpham.splice(Number.parseInt(i), 1)
    }
  }
  this.sum = 0
  for (const i in this.lstsanpham){
    this.sum += this.lstsanpham[i].So_luong * this.lstsanpham[i].Gia_nhap
  }
  this.hoadon.Tong_tien =  this.sum.toString()

  this.modalService.dismissAll()
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });

}

//Hủy thêm sản phẩm
Huy(){
  this.lstsanpham.splice(0, this.lstsanpham.length)
  this.modalService.dismissAll()
}

//Hàm lấy chỉ số sản phẩm
SanPhamIndex(sp){
  let index;
  for (const i in this.lstsanpham){
    for(const j in sp){
      if (this.lstsanpham[i].SanPham_id === sp[j]._id){
        // Nếu tồn tại thì trả về chỉ số
        index = i
        return index
      }else{
        // Không tồn tại thì trả về -1
        index = -1
      }
    }
  }
  return index
}

// Hàm kiểm tra sản phẩm này đã được nhập chưa
KiemTraTrungSanPham(sp){
  let bool = false
  if (this.lstsanpham[0] === undefined){
    bool = true
    return bool
  }else{
    for (const i in this.lstsanpham){
      for(const j in sp){
        if (this.lstsanpham[i].SanPham_id === sp[j]._id){
          bool = false
          return bool
        }else{
          bool = true
        }
      }

    }
    return bool

  }

}

//Chọn nhiều phần tử trong thẻ select
onItemSelect(item: any, i?) {
  // i = 0 là tạo mới, = 1 là cập nhật
  if (i === 0 ){
    document.getElementById('errSanPham').style.display = 'none'
  }else{
    if (i === 1){
      document.getElementById('SanPham').style.display = 'none'
    }
  }
  // console.log(this.sanphamtmp)
}

// Xử lý chuỗi dropdown
onSelectAll(items: any, i?) {
  if (i === 0 ){
    document.getElementById('errSanPham').style.display = 'none'
  }else{
    if (i === 1){
      document.getElementById('SanPham').style.display = 'none'
    }
  }
}

onDeSelectAll(items: any, i?){

  if (i === 0 ){
    document.getElementById('errSanPham').style.display = 'none'
  }else{
    if (i === 1){
      document.getElementById('SanPham').style.display = 'none'
    }
  }

}

onItemDeSelect(item: any, i?){

  if (i === 0 ){
    document.getElementById('errSanPham').style.display = 'none'
  }else{
    if (i === 1){
      document.getElementById('SanPham').style.display = 'none'
    }
  }
}

// Kiểm tra số lượng và giá có lớn hơn 0 hay không
KiemTraGiaTri(){
  if (this.So_luong <= 0){
    document.getElementById('errSoLuong').style.display = 'block'
  }else {
    document.getElementById('errSoLuong').style.display = 'none'
  }

  if (this.Gia_nhap <= 0){
    document.getElementById('errGiaNhap').style.display = 'block'
  }else {
    document.getElementById('errGiaNhap').style.display = 'none'
  }
}

}
