import { DanhMucNhoModel } from './../../../models/DanhMuc/DanhMucNho';
import { DanhMucModel } from './../../../models/DanhMuc/danhmuc';
import { DanhmucService } from './../../../services/DanhMuc/danhmuc.service';
import { KhuyenmaiService } from './../../../services/KhuyenMai/khuyenmai.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KhuyenMaiModel } from './../../../models/KhuyenMai/khuyenmai';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { formatDate } from "@angular/common";
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  khuyenmai: KhuyenMaiModel;
  danhmuc: DanhMucModel;
  thongtindanhmucnho = [];
  DMN = [];
  arrDMN: DanhMucNhoModel[] = [];
  danhmucnho: DanhMucModel[] = [];
  subdanhmuc: DanhMucNhoModel[] = [];
  arrdanhmucnho: DanhMucNhoModel[] = [];
  arrtmp = {};
  danhmuctmp = []
  dskhuyenmais: KhuyenMaiModel;
  keyword: string;
  dskhuyenmai: KhuyenMaiModel[] = [];
  dskhuyenmaisearch: KhuyenMaiModel[] = [];
  lengthdskhuyenmai = 0;
  checked = [];
  checkAll = false;
  khuyenmaiID: string;
  flag = false;
  KiemTraThongTin = false;
  arrPTTT_ID = [];
  arrTen_PTTT = [];
  lengthchecked = 0;
  dropdownSettings: IDropdownSettings;
  constructor(private modalService: NgbModal, private khuyenmaiService: KhuyenmaiService, private danhmucService: DanhmucService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.khuyenmaiService.getRefeshPage().subscribe(dt => {
      this.getdskhuyenmai();
    })
    this.getdskhuyenmai();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'DMN_id',
      textField: 'Ten_danh_muc_nho',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  // Hàm lấy danh sách
  getdskhuyenmai() {
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;

      // hỗ trợ searchbykeywword và searchbysex
      this.dskhuyenmaisearch = res.khuyenmais;
      // Lưu độ dài của danh sách  để làm checkbox
      this.lengthdskhuyenmai = this.dskhuyenmai.length;

      this.dskhuyenmais = res.khuyenmais;
      // Thiết lập mảng giá trị checked = false cho các đối tượng
      for (const length in this.dskhuyenmai) {
        if (this.dskhuyenmai.hasOwnProperty(length)) {
          this.checked.push(false);
        }
      }
      this.getdsDanhMucNho(this.dskhuyenmais)
    });
  }

  // Lấy danh sách danh mục
  getdsDanhMucNho(ds) {
    try {
      this.danhmucService.getListDanhMuc().subscribe((res: any) => {

        this.danhmuc = res.danhmucs;
        for (const dm in this.danhmuc) {
          if (this.danhmuc[dm].Danh_muc_nho.length !== 0) {
            for (const dmn in this.danhmuc[dm].Danh_muc_nho)
              this.subdanhmuc.push(this.danhmuc[dm].Danh_muc_nho[dmn])
          }
        }
        this.compareDMN_id(ds)

      })

    } catch (error) {
      alert(error)
    };
  }


  // Tìm đối tượng danh mục nhỏ trong DANH MỤC khớp DMN_id với DMN_id trong KHUYẾN MÃI
  compareDMN_id(ds) {
    this.arrDMN = []
    this.thongtindanhmucnho.splice(0, this.thongtindanhmucnho.length)
    for (const dmn in ds) {
      for (const dmn2 in ds[dmn].Danh_muc_nho) {
        for (const dmn3 in this.subdanhmuc) {
          if (ds[dmn].Danh_muc_nho[dmn2].DMN_id === this.subdanhmuc[dmn3].DMN_id) {
            this.arrDMN.push(this.subdanhmuc[dmn3])
          }
        }
      }
      this.thongtindanhmucnho.push(this.arrDMN)
      this.arrDMN = [];
    }
  }

  // Bắt sự kiện thay đổi DMN
  ChangeDMN() {
    const a = document.getElementById('CreateDMNSelect') as HTMLInputElement
    document.getElementById('errTaoDanhMuc').style.display = 'none'
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
    this.dskhuyenmai = this.dskhuyenmaisearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdskhuyenmai();
    } else {
      this.dskhuyenmai = this.dskhuyenmai.filter(res => {
        const hoten = this.removeAccents(res.Ten_khuyen_mai);
        const maso = this.removeAccents(res._id);
        const tmp2 = text.replace(/·/g, '');
        if (hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        } else {
          if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
            return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
          }
        }
      });
    }
  }

  SearchByOption(value) {
    this.dskhuyenmai = this.dskhuyenmaisearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'Cũ nhất') {
      this.getdskhuyenmai();
    } else {
      if (target === 'Mới nhất') {
        this.dskhuyenmai.reverse();
      }
    }
  }

  // Bỏ chọn tất cả checkbox
  UnChecked() {
    this.checkAll = true
    this.KTCheckedAll()
  }

  // Hàm kiểm tra checked tại các item
  KTChecked(i: string) {
    this.lengthchecked = 0;
    this.checked[i] = !this.checked[i];
    if (this.checkAll) {
      this.checkAll = false;
    }

    // Kiểm tra có checkbox nào được check hay không, nếu có thì hiển thị divbutton
    for (const kt in this.checked) {
      if (this.checked.hasOwnProperty(kt)) {
        if (this.checked[kt]) {
          this.lengthchecked += 1;
          document.getElementById('divbutton').style.display = 'block';
          // break;
        } else {
          document.getElementById('divbutton').style.display = 'none';
        }
      }
    }
    // Nếu các checkbox đều được check thì checbox chechkAll cũng được check
    if (this.lengthchecked === this.checked.length) {
      this.checkAll = true;
    }
    // Mở divbutton khi có checkbox được check
    if (this.lengthchecked > 0) {
      document.getElementById('divbutton').style.display = 'block';

    }
  }

  // Hàm xử lý sự kiện checked tại ô checkbox tổng
  KTCheckedAll() {
    if (this.checkAll) {
      this.checkAll = false;
      this.checked = [];
      for (let i = 0; i < this.lengthdskhuyenmai; i++) {
        this.checked.push(false);
        document.getElementById('divbutton').style.display = 'none';
      }
    } else {
      this.checkAll = true;
      this.checked = [];
      for (let i = 0; i < this.lengthdskhuyenmai; i++) {
        this.checked.push(true);
        document.getElementById('divbutton').style.display = 'block';
      }
    }
  }

  // Hàm mở Dialog Tạo tài khoản
  open(content) {
    this.danhmuctmp = []
    this.UnChecked();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.khuyenmai = new KhuyenMaiModel();
    this.khuyenmai.Danh_muc_nho = [{ DMN_id: '' }]
    // Gán giá trị rỗng ban đầu cho giới tính
  }

  // Hàm mở Dialog Xác nhận xóa tài khoản
  open_delete(content_delete, _id?) {
    if (_id != null) {
      this.UnChecked();
      this.khuyenmaiID = _id;
      this.flag = false;
    } else {
      this.flag = true;
    }
    this.modalService.open(content_delete, { ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false });

  }

  // Hàm mở Dialog Cập nhật tài khoản
  open_update(content_update, khuyenmaiUpdate) {

    this.UnChecked();
    this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.khuyenmai = new KhuyenMaiModel();
    khuyenmaiUpdate.Ngay_bat_dau = this.datePipe.transform(khuyenmaiUpdate.Ngay_bat_dau, 'yyyy-MM-dd');
    khuyenmaiUpdate.Ngay_ket_thuc = this.datePipe.transform(khuyenmaiUpdate.Ngay_ket_thuc, 'yyyy-MM-dd');
    // console.log(khuyenmaiUpdate.Ngay_bat_dau)
    this.khuyenmai = khuyenmaiUpdate;
    for (const dmn2 in khuyenmaiUpdate.Danh_muc_nho) {
      for (const dm in this.subdanhmuc) {
        if (khuyenmaiUpdate.Danh_muc_nho[dmn2].DMN_id === this.subdanhmuc[dm].DMN_id) {
          this.DMN.push(this.subdanhmuc[dm])
        }
      }
    }
    // this.compareDMN_id([khuyenmaiUpdate])

  }
  // Đóng dialog
  DongModal() {
    this.modalService.dismissAll();
    location.reload();
  }
  // Hàm kiểm tra thông tin
  KTNull(khuyenmai: KhuyenMaiModel) {

    const Ten_phuong_thuc = khuyenmai.Ten_khuyen_mai;
    const thongtinphuongthuc = [];
    thongtinphuongthuc.push(Ten_phuong_thuc, khuyenmai.Ngay_bat_dau, khuyenmai.Ngay_ket_thuc);
    for (const i in thongtinphuongthuc) {
      if (thongtinphuongthuc.hasOwnProperty(i)) {
        if (thongtinphuongthuc[i] === undefined || thongtinphuongthuc[i] === '' || thongtinphuongthuc[i] === null) {
          window.alert('Hãy nhập đầy đủ thông tin!');
          this.KiemTraThongTin = false;
          break;
        } else {
          this.KiemTraThongTin = true;
        }
      }
    }
  }

  // Hàm thực hiện thêm tài khoản nhân viên
  ThemKhuyenMai() {
    console.log(this.danhmuctmp)
    if (this.danhmuctmp[0] === undefined) {
      document.getElementById('errTaoDanhMuc').style.display = 'block'
      this.KiemTraThongTin = false;
    } else {
      for (const i in this.danhmuctmp) {
        this.khuyenmai.Danh_muc_nho.push({ DMN_id: this.danhmuctmp[i].DMN_id })
      }
      this.KTNull(this.khuyenmai);
      if (this.KiemTraThongTin && this.KiemTraNgayKhuyenMai(this.khuyenmai.Ngay_bat_dau, this.khuyenmai.Ngay_ket_thuc)) {
        for (const i in this.khuyenmai.Danh_muc_nho) {
          if (this.khuyenmai.Danh_muc_nho[i].DMN_id === '') {
            this.khuyenmai.Danh_muc_nho.splice(Number.parseInt(i), 1)
          }
        }
        this.khuyenmaiService.ThemKhuyenMai(this.khuyenmai).subscribe(data_them => {
          if (JSON.stringify(data_them) === '"Tạo khuyến mãi thành công!"') {

            // this.DongModal();
            this.modalService.dismissAll()
          }
          else {
            window.alert(data_them);
          }
        });
      }
    }

  }

  // Xóa danh mục nhỏ
  XoaDanhMucNho(e) {
    for (const i in this.khuyenmai.Danh_muc_nho) {
      if (this.khuyenmai.Danh_muc_nho[i].DMN_id === e.DMN_id) {
        this.khuyenmai.Danh_muc_nho.splice(Number.parseInt(i), 1)
        this.DMN.splice(Number.parseInt(i), 1)
      }
    }
  }


  KiemTraNgayKhuyenMai(ngaybatdau, ngayketthuc) {
    if ((new Date(ngaybatdau).getTime() > new Date(ngayketthuc).getTime())) {
      document.getElementById('errNgayKetThuc').style.display = 'block'
      document.getElementById('errNgayKetThuc2').style.display = 'none'
      return false
    } else {
      document.getElementById('errNgayKetThuc').style.display = 'none'
      return true
    }

  }

  // Bắt sự kiện chọn ngày
  ChangeDate(e) {
    e.preventDefault();
    const target = e.target;
    if (target.id === 'Ngay_BD') {
      document.getElementById('errNgayBatDau').style.display = 'none'
    } else {
      if (target.id === 'Ngay_KT') {
        document.getElementById('errNgayKetThuc2').style.display = 'none'
      }
    }
  }

  // Hàm thực hiện cập nhật thông tin
  CapNhatKhuyenMai() {
    this.KTNull(this.khuyenmai);

    if (this.KiemTraThongTin && this.KiemTraNgayKhuyenMai(this.khuyenmai.Ngay_bat_dau, this.khuyenmai.Ngay_ket_thuc)) {
      this.khuyenmaiService.CapNhatKhuyenMai(this.khuyenmai).subscribe(data_capnhat => {
        if (JSON.stringify(data_capnhat) === '"Cập nhật khuyến mãi thành công!"') {
         // this.DongModal();
         this.modalService.dismissAll()
        } else {
          window.alert(data_capnhat);
        }
      });
    }
  }

  //Chọn nhiều phần tử trong thẻ select
  onItemSelect(item: any, i?) {
    this.danhmuctmp.push(item)
    // i = 0 là tạo mới, = 1 là cập nhật
    if (i === 0) {
      document.getElementById('errTaoDanhMuc').style.display = 'none'
    } else {
      if (i === 1) {
        document.getElementById('DanhMucNho').style.display = 'none'
      }
    }
    // console.log(this.danhmuctmp)
  }

  onSelectAll(items: any, i?) {
    this.danhmuctmp.push(items)
    console.log(this.danhmuctmp)
    if (i === 0) {
      document.getElementById('errTaoDanhMuc').style.display = 'none'
    } else {
      if (i === 1) {
        document.getElementById('DanhMucNho').style.display = 'none'
      }
    }
  }

  onDeSelectAll(items: any, i?) {
    this.danhmuctmp = []

    if (i === 0) {
      document.getElementById('errTaoDanhMuc').style.display = 'block'
    } else {
      if (i === 1) {
        document.getElementById('DanhMucNho').style.display = 'block'
      }
    }    // console.log(this.danhmuctmp)

  }

  onItemDeSelect(item: any, i?) {
    for (const j in this.danhmuctmp) {
      if (this.danhmuctmp[j].DMN_id === item.DMN_id) {
        this.danhmuctmp.splice(Number.parseInt(j), 1)
        if (this.danhmuctmp[0] === undefined) {
          if (i === 0) {
            document.getElementById('errTaoDanhMuc').style.display = 'block'
          } else {
            if (i === 1) {
              document.getElementById('DanhMucNho').style.display = 'block'
            }
          }
        }
      }
    }
  }

  // Mãng  được check
  KhuyenmaiChecked() {
    this.arrPTTT_ID = [];
    this.arrTen_PTTT = [];
    for (const kt in this.checked) {
      if (this.checked.hasOwnProperty(kt)) {
        if (this.checked[kt] === true) {
          this.arrPTTT_ID.push(this.dskhuyenmai[kt]._id);
          this.arrTen_PTTT.push(this.dskhuyenmai[kt].Ten_khuyen_mai);
        }
      }
    }
  }
  // Hàm xóa nhiều
  XoaNhieuKhuyenmai() {
    this.KhuyenmaiChecked();
    this.khuyenmaiService.XoaNhieuKhuyenMai(this.arrPTTT_ID).subscribe(data_xoanhieu => {
      if (JSON.stringify(data_xoanhieu) === '"Xóa khuyến mãi thành công!"') {
       // this.DongModal();
       this.modalService.dismissAll()
      } else {
        window.alert(data_xoanhieu);
      }
    });
  }

  // Hàm thực hiện xóa
  XoaKhuyenmai(_id: string) {
    this.khuyenmaiService.XoaKhuyenMai(_id).subscribe(data_xoa => {
     // location.reload();
    });
  }

  // Thực hiện xóa sau khi xác nhận Dialog
  XacNhan() {
    if (this.flag === true) {
      this.XoaNhieuKhuyenmai();
    } else {
      this.XoaKhuyenmai(this.khuyenmaiID);
    }
    this.modalService.dismissAll();
  }

  open_category_plus(content_info_category_plus) {
    this.modalService.open(content_info_category_plus, {
      ariaLabelledBy: 'modal-basic-title-info-mail-plus',
      backdrop: 'static', keyboard: false
    });
  }

  KiemTraTrungDMN_id(khuyenmai, arrdanhmuc) {
    for (const i in khuyenmai.Danh_muc_nho) {
      for (const j in arrdanhmuc) {
        if (khuyenmai.Danh_muc_nho[i].DMN_id === arrdanhmuc[j].DMN_id) {
          this.danhmuctmp.splice(Number.parseInt(j), 1)
        }
      }
    }
  }

  ThemDanhMucNho(content_update) {
    if (this.danhmuctmp[0] === undefined) {
      document.getElementById('DanhMucNho').style.display = 'block'

    } else {
      document.getElementById('DanhMucNho').style.display = 'none'
      this.KiemTraTrungDMN_id(this.khuyenmai, this.danhmuctmp)

      for (const i in this.danhmuctmp) {
        this.khuyenmai.Danh_muc_nho.push({ DMN_id: this.danhmuctmp[i].DMN_id })
        this.DMN.push(this.danhmuctmp[i])
      }

      this.modalService.dismissAll();
      this.modalService.open(content_update, {
        ariaLabelledBy: 'modal-basic-title-info-mail-plus',
        backdrop: 'static', keyboard: false
      });
    }
  }
}
