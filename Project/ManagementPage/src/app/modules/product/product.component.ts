import { HoaDonNhapHangModel } from './../../../models/HoaDonNhapHang/hoadonnhaphang';
import { HoadonnhaphangService } from './../../../services/HoaDonNhapHang/hoadonnhaphang.service';
import { DanhMucNhoModel } from './../../../models/DanhMuc/DanhMucNho';
import { DanhMucModel } from './../../../models/DanhMuc/danhmuc';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { DanhmucService } from './../../../services/DanhMuc/danhmuc.service';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/analytics';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  sanpham: SanPhamModel;
  danhmuc: DanhMucModel;

  dssanpham: SanPhamModel[] = [];
  dssanphamsearch: SanPhamModel[] = [];
  dshoadonnhap: HoaDonNhapHangModel
  subdanhmuc: DanhMucNhoModel[] = []
  arrDMN: DanhMucNhoModel[] = [];

  thongtindanhmucnho = []
  keyword: string;
  checked = [];
  checkAll = false;
  danhmuctmp = []
  lengthdssanpham = 0;
  flag = false;
  sanphamID: string;
  dropdownSettings: IDropdownSettings;
  choosefile = false;
  lengthchecked = 0;
  KiemTraThongTin = false;
  url: any;
  noi_dung = '';
  arrSanPham_ID = [];

  firebaseConfig = {
    apiKey: "AIzaSyB5XhGTH_qmY-E5SKq0x9xvvadjtqPeXQQ",
    authDomain: "managementimagesgreenlife.firebaseapp.com",
    projectId: "managementimagesgreenlife",
    storageBucket: "managementimagesgreenlife.appspot.com",
    messagingSenderId: "206299427924",
    appId: "1:206299427924:web:63b6f139ee2c4d059f69c1",
    measurementId: "G-QZHVZRPBCT"
  };

  constructor(private modalService: NgbModal, private sanphamService: SanphamService, private danhmucService: DanhmucService, private hoadonnhapService: HoadonnhaphangService) { }

  ngOnInit(): void {
    this.getdsSanPham();
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'DMN_id',
      textField: 'Ten_danh_muc_nho',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(this.firebaseConfig);
      firebase.analytics();
    } else {
      firebase.app(); // if already initialized, use that one
    }

  }

  getdsSanPham() {
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.sanpham = res.sanphams;
      this.dssanpham = res.sanphams;

      // hỗ trợ searchbykeywword và searchbysex
      this.dssanphamsearch = res.sanphams;
      // Lưu độ dài của danh sách  để làm checkbox
      this.lengthdssanpham = this.dssanpham.length;
      for (const length in this.dssanpham) {
        if (this.dssanpham.hasOwnProperty(length)) {
          this.checked.push(false);
        }
      }
      this.getdsDanhMucNho(this.dssanpham)
    })
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
      console.log(error)
    };
  }

  // Kiểm tra file có được upload hay không
  chooseFile() {
    const f = document.querySelector('#photo') as HTMLInputElement;
    const file = f.files[0];
    if (file !== undefined) {
      document.getElementById('err_upload').style.display = 'none';
      this.choosefile = true;
    } else {
      this.choosefile = false
    }
  }

  //upload lên firebase và gọi hàm lưu vào csdl
  uploadImageandSave(flag?: number) {
    if (this.choosefile) {
      const ref = firebase.storage().ref();
      const f = document.querySelector('#photo') as HTMLInputElement;
      const file = f.files[0];

      if (file === undefined) {
        this.CapNhatSanPham(this.sanpham.Hinh_anh)
      } else {
        const name = new Date() + '-' + file.name;
        const metadata = {
          contentType: file.type
        };
        const task = ref.child(name).put(file, metadata);
        task
          .then(snapshot => snapshot.ref.getDownloadURL())
          .then(url => {
            // console.log(url),
            this.url = url;
            // alert("Image upload succesful")
            if (flag === 1) {
              this.CapNhatSanPham(this.url)
            } else {
              this.ThemSanPham(this.url);
            }
          }
          );
      }
    } else {
      this.ThemSanPham(null);
    }

  }

  //  // Tìm đối tượng danh mục nhỏ trong DANH MỤC khớp DMN_id với DMN_id trong KHUYẾN MÃI
  compareDMN_id(ds) {
    this.arrDMN = []
    this.thongtindanhmucnho.splice(0, this.thongtindanhmucnho.length)
    for (const dmn in ds) {
      for (const dmn2 in ds[dmn].Danh_Muc) {
        for (const dmn3 in this.subdanhmuc) {
          if (ds[dmn].Danh_Muc[dmn2].DMN_id === this.subdanhmuc[dmn3].DMN_id) {
            this.arrDMN.push(this.subdanhmuc[dmn3])
          }
        }
      }
      this.thongtindanhmucnho.push(this.arrDMN)
      this.arrDMN = [];
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
    this.dssanpham = this.dssanphamsearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdsSanPham();
    } else {
      this.dssanpham = this.dssanpham.filter(res => {
        const ten = this.removeAccents(res.Ten_san_pham);
        const maso = this.removeAccents(res._id);
        const tmp2 = text.replace(/·/g, '');
        if (ten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return ten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        } else {
          if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
            return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
          }
        }
      });
    }
  }

  SearchByOption(value) {
    this.dssanpham = this.dssanphamsearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'Cũ nhất') {
      this.getdsSanPham();
    } else {
      if (target === 'Mới nhất') {
        this.dssanpham.reverse();
      }
    }
  }

  // Bỏ chọn tất cả checkbox
  UnChecked() {
    this.checkAll = true
    this.KTCheckedAll()
  }

  // Hàm xử lý sự kiện checked tại ô checkbox tổng
  KTCheckedAll() {
    if (this.checkAll) {
      this.checkAll = false;
      this.checked = [];
      for (let i = 0; i < this.lengthdssanpham; i++) {
        this.checked.push(false);
        document.getElementById('divbutton').style.display = 'none';
      }
    } else {
      this.checkAll = true;
      this.checked = [];
      for (let i = 0; i < this.lengthdssanpham; i++) {
        this.checked.push(true);
        document.getElementById('divbutton').style.display = 'block';
      }
    }
  }

  // Hàm mở Dialog Tạo
  open(content) {
    this.choosefile = false
    this.danhmuctmp = []
    this.UnChecked();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu
    this.sanpham = new SanPhamModel();
    this.sanpham.Danh_Muc = [{ DMN_id: '' }]
  }

  // Hàm mở Dialog Cập nhật tài khoản
  open_update(content_update, sanphamUpdate) {
    this.choosefile = true
    this.UnChecked();
    this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
    this.sanpham = new SanPhamModel();
    this.sanpham = sanphamUpdate;
    this.noi_dung = this.sanpham.Mo_ta
    for (const i in this.subdanhmuc){
      if (this.subdanhmuc[i].DMN_id === this.sanpham.Danh_Muc[0].DMN_id){
        this.danhmuctmp.push(this.subdanhmuc[i])
      }
    }
    this.err_message(this.sanpham)
  }

  // Hàm mở Dialog Xác nhận xóa tài khoản
  open_delete(content_delete, _id?) {
    if (_id != null) {
      this.UnChecked();
      this.sanphamID = _id;
      this.flag = false;
    } else {
      this.flag = true;
    }
    this.modalService.open(content_delete, { ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false });

  }

  //Chọn nhiều phần tử trong thẻ select
  onItemSelect(item: any, i?) {
    // i = 0 là tạo mới, = 1 là cập nhật
    if (i === 0) {
      document.getElementById('errTaoDanhMuc').style.display = 'none'
    } else {
      if (i === 1) {
        document.getElementById('DanhMucNho').style.display = 'none'
      }
    }
  }

  onItemDeSelect(item: any, i?) {
        if (this.danhmuctmp[0] === undefined) {
          if (i === 0) {
            document.getElementById('errTaoDanhMuc').style.display = 'block'
          } else {
            if (i === 1) {
              document.getElementById('DanhMucNho').style.display = 'none'
            }
          }
        }

  }

  ThemSanPham(url) {
    this.sanpham.Hinh_anh = url
    this.sanpham.Mo_ta = this.noi_dung

    this.KTNull(this.sanpham);

    if (this.KiemTraThongTin) {
      if (this.danhmuctmp[0] === undefined) {
        document.getElementById('errTaoDanhMuc').style.display = 'block'
        this.KiemTraThongTin = false;
      }
      else {
        for (const i in this.danhmuctmp) {
          this.sanpham.Danh_Muc.push({ DMN_id: this.danhmuctmp[i].DMN_id })
        }
        for (const i in this.sanpham.Danh_Muc) {
          if (this.sanpham.Danh_Muc[i].DMN_id === '') {
            this.sanpham.Danh_Muc.splice(Number.parseInt(i), 1)
          }
        }
        this.sanphamService.ThemSanPham(this.sanpham).subscribe(data_them => {
          if (JSON.stringify(data_them) === '"Tạo sản phẩm thành công!"') {
            this.DongModal();
          }
          else {
            window.alert(data_them);
            this.sanpham.Danh_Muc = [{ DMN_id: '' }]
          }
        });
      }


    }
  }

  // Đóng dialog
  DongModal() {
    this.modalService.dismissAll();
    location.reload();
  }
  // Hàm kiểm tra thông tin
  KTNull(sanpham: SanPhamModel) {
    const Ten_san_pham = sanpham.Ten_san_pham;
    const Gia = sanpham.Gia
    const thongtinsanpham = [];
    thongtinsanpham.push(Ten_san_pham, sanpham.Gia, sanpham.Hinh_anh);
    for (const i in thongtinsanpham) {
     if (Gia > 0 && Gia != null){
      if (thongtinsanpham.hasOwnProperty(i)) {
        if (thongtinsanpham[i] === undefined || thongtinsanpham[i] === '' || thongtinsanpham[i] === null) {
          window.alert('Hãy nhập đầy đủ thông tin!');
          this.KiemTraThongTin = false;
          break;
        } else {
          this.KiemTraThongTin = true;
        }
      }
     }else{
       document.getElementById('errGia').style.display = 'block'
     }
    }
  }

  KiemTraSoNguyen(){
    if (this.sanpham.Gia <0 || this.sanpham.Gia === null){
      document.getElementById('errGia').style.display = 'block'
    }else{
      document.getElementById('errGia').style.display = 'none'

    }
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


  // Thực hiện xóa sau khi xác nhận Dialog
  XacNhan() {
    if (this.flag === true) {
      this.XoaNhieuSanPham();
    } else {
      this.XoaSanPham(this.sanphamID);
    }
    this.modalService.dismissAll();
  }

  // Mãng  được check
  SanPhamChecked() {
    this.arrSanPham_ID = [];
    for (const kt in this.checked) {
      if (this.checked.hasOwnProperty(kt)) {
        if (this.checked[kt] === true) {
          this.arrSanPham_ID.push(this.dssanpham[kt]._id);
        }
      }
    }
  }

  // Hàm xóa nhiều
  XoaNhieuSanPham() {
    this.SanPhamChecked();
    this.sanphamService.XoaNhieuSanPham(this.arrSanPham_ID).subscribe(data_xoanhieu => {
      if (JSON.stringify(data_xoanhieu) === '"Xóa sản phẩm thành công!"') {
        this.DongModal();
      } else {
        window.alert(data_xoanhieu);
      }
    });
  }

  // Hàm thực hiện xóa
  XoaSanPham(_id: string) {
    this.sanphamService.XoaSanPham(_id).subscribe(data_xoa => {
      location.reload();
    });
  }

  // Thông báo lỗi khi chưa nhập dữ liệu
  err_message(sp: SanPhamModel) {
    if (sp.Ten_san_pham !== null) {
      document.getElementById('errTaoDanhMuc').style.display = 'none'
    } else {
      document.getElementById('errTaoDanhMuc').style.display = 'block'
    }

    if (sp.Hinh_anh !== null) {
      document.getElementById('err_upload').style.display = 'none'
    } else {
      document.getElementById('err_upload').style.display = 'block'
    }

    if(sp.Gia !== null && sp.Gia > 0){
      document.getElementById('errGia').style.display = 'none'
    }else{
      document.getElementById('errGia').style.display = 'block'

    }
  }

  CapNhatSanPham(url) {
    this.sanpham.Hinh_anh = url
    this.sanpham.Mo_ta = this.noi_dung
    this.sanpham.Danh_Muc[0].DMN_id = this.danhmuctmp[0].DMN_id
    this.KTNull(this.sanpham)

    if (this.KiemTraThongTin) {
      this.sanphamService.CapNhatSanPham(this.sanpham).subscribe(dt => {
        if (JSON.stringify(dt) === '"Cập nhật sản phẩm thành công!"') {
          this.DongModal();
        }
        else {
          window.alert(dt);
        }
      });
    }
  }

}
