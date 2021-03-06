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
  sanphams: SanPhamModel[] = []

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
  hienthi = false
  p: number = 1;
  imagePath = 'https://cdn.iconscout.com/icon/free/png-256/gallery-187-902099.png'
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
    this.sanphamService.getRefeshPage().subscribe(() => {
      this.getdsSanPham();
    })

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
      // h??? tr??? searchbykeywword v?? searchbysex
      this.dssanphamsearch = res.sanphams;
      // L??u ????? d??i c???a danh s??ch  ????? l??m checkbox
      this.lengthdssanpham = this.dssanpham.length;
      for (const length in this.dssanpham) {
        if (this.dssanpham.hasOwnProperty(length)) {
          this.checked.push(false);
        }
      }
      if (this.sanphams.length === 0) {
        this.p = 1
      }
      this.ChuyenTrang(this.p)
    })
  }
  // L???y danh s??ch danh m???c
  getdsDanhMucNho(ds) {
    this.subdanhmuc = []
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

  // Ki???m tra file c?? ???????c upload hay kh??ng
  chooseFile() {
    const f = document.querySelector('#photo') as HTMLInputElement;
    const file = f.files[0];
    if (file !== undefined) {
      this.imagePath = '../../../assets/' + file.name
      document.getElementById('err_upload').style.display = 'none';
      this.choosefile = true;
    } else {
      document.getElementById('err_upload').style.display = 'block';
      this.choosefile = false
    }
  }

  //upload l??n firebase v?? g???i h??m l??u v??o csdl
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

  //  // T??m ?????i t?????ng danh m???c nh??? trong DANH M???C kh???p DMN_id v???i DMN_id trong KHUY???N M??I
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

  // H??m chuy???n ?????i ti???ng Vi???t sang ti???ng Anh
  removeAccents(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/??/g, 'd').replace(/??/g, 'D')
      ;
  }

  // H??m t??m ki???m theo t??n ho???c id
  SearchByKeyWord() {
    this.sanphams = this.dssanphamsearch;
    let text = this.removeAccents(this.keyword);
    // text += ' '
    if (text === '') {
      this.getdsSanPham();
    } else {
      this.sanphams = this.sanphams.filter(res => {
        let ten = this.removeAccents(res.Ten_san_pham);
        ten += ' '
        const maso = this.removeAccents(res._id);
        let tmp2 = text.replace(/??/g, '');
        tmp2 += ' '
        if (ten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return ten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        } else {
          if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
            return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
          }
        }
      });

      this.compareDMN_id(this.sanphams);
    }
  }

  SearchByOption(value) {
    this.sanphams = this.dssanphamsearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'C?? nh???t') {
      this.getdsSanPham();
    } else {
      if (target === 'M???i nh???t') {
        this.sanphams.reverse();
        this.thongtindanhmucnho.reverse();
        this.ChuyenTrang(this.p)
      }
    }
  }

  // B??? ch???n t???t c??? checkbox
  UnChecked() {
    this.checkAll = true
    this.KTCheckedAll()
  }

  // H??m x??? l?? s??? ki???n checked t???i ?? checkbox t???ng
  KTCheckedAll() {
    if (this.checkAll) {
      this.checkAll = false;
      this.checked = [];
      for (let i = 0; i < this.sanphams.length; i++) {
        this.checked.push(false);
        document.getElementById('divbutton').style.display = 'none';
      }
    } else {
      this.checkAll = true;
      this.checked = [];
      for (let i = 0; i < this.sanphams.length; i++) {
        this.checked.push(true);
        document.getElementById('divbutton').style.display = 'block';
      }
    }
  }

  // H??m m??? Dialog T???o
  open(content) {
    this.choosefile = false
    this.danhmuctmp = []
    this.noi_dung = ''
    this.UnChecked();
    this.imagePath = 'https://cdn.iconscout.com/icon/free/png-256/gallery-187-902099.png'

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, size: 'lg' });
    // G??n gi?? tr??? r???ng ban ?????u
    this.sanpham = new SanPhamModel();
    this.sanpham.Danh_Muc = [{ DMN_id: '' }]
  }

  // H??m m??? Dialog C???p nh???t t??i kho???n
  open_update(content_update, sanphamUpdate) {
    this.choosefile = true
    this.UnChecked();
    this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false, size: 'lg' });
    // G??n gi?? tr??? r???ng ban ?????u cho nhanvien, n???u kh??ng s??? b??o l???i kh??ng ?????c ???????c undefine
    this.sanpham = new SanPhamModel();
    this.sanpham = sanphamUpdate;
    this.noi_dung = this.sanpham.Mo_ta
    this.imagePath = this.sanpham.Hinh_anh
    for (const i in this.subdanhmuc) {
      if (this.subdanhmuc[i].DMN_id === this.sanpham.Danh_Muc[0].DMN_id) {
        this.danhmuctmp.push(this.subdanhmuc[i])
      }
    }
    this.err_message(this.sanpham)
  }

  // H??m m??? Dialog X??c nh???n x??a t??i kho???n
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

  //Ch???n nhi???u ph???n t??? trong th??? select
  onItemSelect(item: any, i?) {
    // i = 0 l?? t???o m???i, = 1 l?? c???p nh???t
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
          if (JSON.stringify(data_them) === '"T???o s???n ph???m th??nh c??ng!"') {
            // this.DongModal();
            this.modalService.dismissAll()
          }
          else {
            window.alert(data_them);
            this.sanpham.Danh_Muc = [{ DMN_id: '' }]
          }
        });
      }
    }
  }

  // ????ng dialog
  DongModal() {
    this.modalService.dismissAll();
    this.sanpham = new SanPhamModel()
    this.imagePath = 'https://cdn.iconscout.com/icon/free/png-256/gallery-187-902099.png'
    // location.reload();
  }
  // H??m ki???m tra th??ng tin
  KTNull(sanpham: SanPhamModel) {
    const Ten_san_pham = sanpham.Ten_san_pham;
    const Gia = sanpham.Gia
    const thongtinsanpham = [];
    thongtinsanpham.push(Ten_san_pham, sanpham.Gia, sanpham.Hinh_anh);
    for (const i in thongtinsanpham) {
      if (Gia > 0 && Gia !== null) {
        if (thongtinsanpham.hasOwnProperty(i)) {
          if (thongtinsanpham[i] === undefined || thongtinsanpham[i] === '' || thongtinsanpham[i] === null) {
            window.alert('H??y nh???p ?????y ????? th??ng tin!');
            this.KiemTraThongTin = false;
            break;
          } else {
            this.KiemTraThongTin = true;
          }
        }
      } else {
        document.getElementById('errGia').style.display = 'block'
        this.KiemTraThongTin = false;
      }
    }
  }

  KiemTraSoNguyen() {

    if (this.sanpham.Gia < 0 || this.sanpham.Gia === null || this.sanpham.Gia === -0) {
      document.getElementById('errGia').style.display = 'block'
    } else {
      document.getElementById('errGia').style.display = 'none'

    }
  }

  // H??m ki???m tra checked t???i c??c item
  KTChecked(i: string) {
    this.lengthchecked = 0;
    this.checked[i] = !this.checked[i];
    if (this.checkAll) {
      this.checkAll = false;
    }

    // Ki???m tra c?? checkbox n??o ???????c check hay kh??ng, n???u c?? th?? hi???n th??? divbutton
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
    // N???u c??c checkbox ?????u ???????c check th?? checbox chechkAll c??ng ???????c check
    if (this.lengthchecked === this.checked.length) {
      this.checkAll = true;
    }
    // M??? divbutton khi c?? checkbox ???????c check
    if (this.lengthchecked > 0) {
      document.getElementById('divbutton').style.display = 'block';

    }
  }


  // Th???c hi???n x??a sau khi x??c nh???n Dialog
  XacNhan() {
    if (this.flag === true) {
      this.XoaNhieuSanPham();
    } else {
      this.XoaSanPham(this.sanphamID);
    }
    this.modalService.dismissAll();
  }

  // M??ng  ???????c check
  SanPhamChecked() {
    this.arrSanPham_ID = [];
    for (const kt in this.checked) {
      if (this.checked.hasOwnProperty(kt)) {
        if (this.checked[kt] === true) {
          this.arrSanPham_ID.push(this.sanphams[kt]._id);
        }
      }
    }
  }

  // H??m x??a nhi???u
  XoaNhieuSanPham() {
    this.SanPhamChecked();
    this.sanphamService.XoaNhieuSanPham(this.arrSanPham_ID).subscribe(data_xoanhieu => {
      if (JSON.stringify(data_xoanhieu) === '"X??a s???n ph???m th??nh c??ng!"') {
        //this.DongModal();
        this.modalService.dismissAll()
      } else {
        window.alert(data_xoanhieu);
      }
    });
  }

  // H??m th???c hi???n x??a
  XoaSanPham(_id: string) {
    this.sanphamService.XoaSanPham(_id).subscribe(data_xoa => {
      // location.reload();
    });
  }

  // Th??ng b??o l???i khi ch??a nh???p d??? li???u
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

    if (sp.Gia !== null && sp.Gia > 0) {
      document.getElementById('errGia').style.display = 'none'
    } else {
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
        if (JSON.stringify(dt) === '"C???p nh???t s???n ph???m th??nh c??ng!"') {
          //  this.DongModal();
          this.keyword = ''
          this.modalService.dismissAll()
        }
        else {
          window.alert(dt);
        }
      });
    }
  }


  HienThiMa() {
    this.hienthi = true
    document.getElementById('AnMa').style.display = 'block'
    document.getElementById('HienThiMa').style.display = 'none'
  }

  AnMa() {
    this.hienthi = false
    document.getElementById('AnMa').style.display = 'none'
    document.getElementById('HienThiMa').style.display = 'block'

  }

  ChuyenTrang(number) {
    this.sanphams = []
    for (let i = 0; i < 10; i++) {
      if ((this.dssanpham[((number - 1) * 10) + i]) !== undefined) {
        this.sanphams.push(this.dssanpham[((number - 1) * 10) + i]);
      }
    }
    this.getdsDanhMucNho(this.sanphams)

    // this.compareDMN_id(this.sanphams)
    this.UnChecked()
  }
}
