import { HoadonnhaphangService } from './../../../services/HoaDonNhapHang/hoadonnhaphang.service';
import { HoadonbanhangService } from './../../../services/HoaDonBanHang/hoadonbanhang.service';
import { HoaDonBanHangModel } from './../../../models/HoaDonBanHang/hoadonbanhang';
import { XaPhuongModel } from './../../../models/DiaChi/xaphuong';
import { QuanHuyenModel } from './../../../models/DiaChi/quanhuyen';
import { DiaChiModel } from './../../../models/DiaChi/diachi';
import { DiachiService } from './../../../services/DiaChi/diachi.service';
import { SanPhamThemModel } from './../../../models/PhieuDat/sanphamthem';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { PhuongthucthanhtoanService } from './../../../services/PhuongThucThanhToan/phuongthucthanhtoan.service';
import { HinhthucvanchuyenService } from './../../../services/HinhThucVanChuyen/hinhthucvanchuyen.service';
import { PhieudatService } from './../../../services/PhieuDat/phieudat.service';
import { KhachhangService } from './../../../services/KhachHang/khachhang.service';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { KhachHangModel } from './../../../models/KhachHang/khachhang';
import { PhuongThucThanhToanModel } from './../../../models/PhuongThucThanhToan/phuongthucthanhtoan';
import { DiaChiDKModle } from './../../../models/DiaChi/Diachi_DK';
import { HinhThucVanChuyenModel } from './../../../models/HinhThucVanChuyen/hinhthucvanchuyen';
import { PhieuDatModel } from './../../../models/PhieuDat/phieudat';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Component, OnInit } from '@angular/core';
import { KhuyenmaiService } from 'src/services/KhuyenMai/khuyenmai.service';
import { KhuyenMaiModel } from 'src/models/KhuyenMai/khuyenmai';
import { timer } from 'rxjs';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  hoadonban: HoaDonBanHangModel
  keyword: string;
  dsphieudat: PhieuDatModel[] = [];
  dsphieudatsearch: PhieuDatModel[] = [];
  thongtinsanpham = [];
  thongtinvanchuyen: HinhThucVanChuyenModel[] = [];
  thongtinthanhtoan: PhuongThucThanhToanModel[] = [];
  arrdiachi: DiaChiDKModle[] = [];
  dsdiachi: DiaChiDKModle[] = [];
  dssanpham: SanPhamModel;
  sanphams: SanPhamModel;
  arrSanPham: SanPhamModel[] = [];
  arrSanPhamReload: SanPhamModel[] = []
  phieudats: PhieuDatModel[] = []

  dshinhthucvanchuyen: HinhThucVanChuyenModel;
  dsphuongthucthanhtoan: PhuongThucThanhToanModel;
  checked = [];
  checkAll = false;
  lengthdsphieudat = 0;
  lengthchecked = 0;
  arrPhieuDat_ID = [];
  sanphamtmp = []
  vanchuyentmp = []
  thanhtoantmp = []
  phieudatID: string;
  phieudat: PhieuDatModel
  dropdownSettings: IDropdownSettings;
  dropdownSettingsVanChuyen: IDropdownSettings;
  dropdownSettingsThanhToan: IDropdownSettings;
  dropdownSettingsKhachHang: IDropdownSettings;
  So_luong = 0;
  Gia_ban = 0
  flag: string
  isdelete = false
  dsSP: SanPhamThemModel
  lstsanpham: SanPhamThemModel[] = []
  sum = 0
  index_update: any
  thanhphos: DiaChiModel[] = [];
  quanhuyens: QuanHuyenModel[] = [];
  arrquanhuyen1: QuanHuyenModel[] = [];
  xaphuongs: XaPhuongModel[] = [];
  arrxaphuong: XaPhuongModel[] = [];
  diachi: DiaChiDKModle[] = [];
  IDKhachHang = []
  dskhachhang: KhachHangModel[] = []
  thanhpho: string;
  quanhuyen: string;
  KiemTraThongTin = false;
  Trang_thai = []
  taikhoan: any
  hienthi = false
  p: number = 1;
  tongphieudat = 0
  dskhuyenmai: KhuyenMaiModel[] = []
  arrgiatrikhuyenmai = []
  thongtinchitietsanpham = []
  phieudatchitiet = []
  colors = [{ status: "Ch??a duy???t", color: "darkgreen" }, { status: "???? duy???t", color: "darkblue" },
  { status: "??ang ???????c ????ng g??i", color: "orange" }, { status: "Xu???t kho", color: "orange" }, { status: "??ang v???n chuy???n", color: "orange" },
  { status: "??ang giao h??ng", color: "orange" }, { status: "Giao h??ng th??nh c??ng", color: "darkgreen" }, { status: "???? h???y", color: "brown" },
  { status: "Giao h??ng th???t b???i", color: "brown" }]

  constructor(private phieudatService: PhieudatService, private hinhthucvanchuyenService: HinhthucvanchuyenService, private phuongthucthanhtoanService: PhuongthucthanhtoanService,
    private sanphamService: SanphamService, private modalService: NgbModal, private diachiService: DiachiService, private hoadonbanService: HoadonbanhangService, private khuyenmaiService: KhuyenmaiService,
    private khachhangService: KhachhangService) { }

  ngOnInit(): void {
    // console.log(btoa("12345678"));
    // console.log(atob("cGFzc3dvcmQ="));
    this.phieudatService.getRefeshPage().subscribe(() => {
      const getdsphieudat = timer(1000, 5000);
      getdsphieudat.subscribe(val => this.ReloadDSPhieuDat());
      this.geteachDiaDiem()
      this.getdsKhachHang()
      this.getdsKhuyenMai()

      const source = timer(1000, 10000); // Tr??n th???c t??? l?? 864000000 (1 ng??y)
      source.subscribe(val => this.TuDongDuyetHoaDon());
    })
    const getdsphieudat = timer(1000, 5000);
    getdsphieudat.subscribe(val => this.ReloadDSPhieuDat());
    this.geteachDiaDiem()
    this.getdsKhachHang()
    this.getdsKhuyenMai()

    this.dropdownSettings = {
      singleSelection: true,
      idField: '_id',
      textField: 'Ten_san_pham',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettingsVanChuyen = {
      singleSelection: true,
      idField: '_id',
      textField: 'Ten_hinh_thuc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettingsThanhToan = {
      singleSelection: true,
      idField: '_id',
      textField: 'Ten_phuong_thuc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettingsKhachHang = {
      singleSelection: true,
      idField: 'Khach_hang_id',
      textField: 'Khach_hang_id',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    const source = timer(1000, 5000); // Tr??n th???c t??? l?? 864000000 (1 ng??y)
    source.subscribe(val => this.TuDongDuyetHoaDon());
  }

  ReloadDSPhieuDat() {
    this.getdsphieudat()
    this.ChuyenTrang(this.p)
  }

  async TuDongDuyetHoaDon() {
    let sanphams = []
    for (const i in this.phieudats) {
      // if ((new Date().getDay() - new Date(this.phieudats[i].Ngay_cap_nhat).getDay() >= 1) && this.phieudats[i].Trang_thai === 'Ch??a duy???t') { //th???c t??? d??ng c??i n??y
      if ((new Date().getTime() > new Date(this.phieudats[i].Ngay_cap_nhat).getTime()) && this.phieudats[i].Trang_thai === 'Ch??a duy???t') {
        this.phieudats[i].Trang_thai = '???? duy???t'
        this.phieudatService.CapNhatPhieuDat(this.phieudats[i]).subscribe(dt => { })
        for (const j in this.dssanpham) {
          for (const h in this.phieudats[i].San_Pham) {
            if (this.dssanpham[j]._id === this.phieudats[i].San_Pham[h].SanPham_id) {
              sanphams.push(this.dssanpham[j])
            }
          }
        }
        for (const i in sanphams) {
          this.arrgiatrikhuyenmai.push(0)
          await this.KiemTraSPKhuyenMai(sanphams[i], Number.parseInt(i))
        }
        this.phieudatService.GuiEmailPhieuDat(this.phieudats[i], this.arrgiatrikhuyenmai).subscribe(data => { })
      }
    }
  }

  ChuyenTrang(number) {
    this.dsphieudat = []
    this.Trang_thai = []
    for (let i = 0; i < 5; i++) {
      if ((this.phieudats[((number - 1) * 5) + i]) !== undefined) {
        this.dsphieudat.push(this.phieudats[((number - 1) * 5) + i]);

      }
    }
    for (const i in this.dsphieudat) {
      this.Trang_thai.push(this.dsphieudat[i].Trang_thai)
    }
    for (const length in this.dsphieudat) {
      if (this.dsphieudat.hasOwnProperty(length)) {
        this.checked.push(false);
      }
    }
    this.getdsHinhThucVanChuyen(this.dsphieudat)
    this.getdsPhuongThucThanhToan(this.dsphieudat)
    this.getdsSanPham(this.dsphieudat)

    for (const dc in this.dsphieudat) {
      if (this.dsphieudat.hasOwnProperty(dc)) {
        this.dsdiachi.push(this.dsphieudat[dc].Dia_chi);
      }
    }

    for (const dc in this.dsdiachi) {
      if (this.dsdiachi.hasOwnProperty(dc)) {
        this.arrdiachi.push(this.dsdiachi[dc][0]);
      }
    }
    // this.UnChecked()
  }

  getdsKhachHang() {
    this.khachhangService.getListKhachHang().subscribe((res: any) => {
      this.dskhachhang = res.khachhangs
    })
  }

  // L???y th??ng tin t??i kho???n hi???n ??ang thao t??c
  getthongtintaikhoan() {
    this.taikhoan = JSON.parse(localStorage.getItem('loggedInAcount'));
  }

  getdsphieudat() {
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {

      this.phieudats = res.phieudats;
      this.tongphieudat = this.phieudats.length
      if (this.dsphieudat.length === 0) {
        this.p = 1
      }
      this.ChuyenTrang(this.p)
      // h??? tr??? searchbykeywword v?? searchbysex
      this.dsphieudatsearch = res.phieudats;
      this.lengthdsphieudat = this.dsphieudat.length;
    })

  }

  getdsKhuyenMai() {
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;
    });

  }
  // Tr??? v??? m??u s???c cho tr???ng th??i ???????c hi???n th??? tr??n table
  getColor(status) {
    return this.colors.filter(item => item.status === status)[0].color
  }

  // Ch???n khuy???n m??i cao nh???t c???a t???ng s???n ph???m
  KiemTraSPKhuyenMai(eachSP, index) {
    let arrKhuyenMai = [];
    let giatrikhuyenmai = 0;
    for (const i in this.dskhuyenmai) {
      if (this.dskhuyenmai.hasOwnProperty(i)) {
        for (const j in this.dskhuyenmai[i].Danh_muc_nho) {
          if (this.dskhuyenmai[i].Danh_muc_nho.hasOwnProperty(j)) {
            if (this.dskhuyenmai[i].Danh_muc_nho[j].DMN_id === eachSP.Danh_Muc[0].DMN_id) {
              if (new Date(this.dskhuyenmai[i].Ngay_bat_dau).getTime() < new Date().getTime()
                && new Date(this.dskhuyenmai[i].Ngay_ket_thuc).getTime() > new Date().getTime()) {
                arrKhuyenMai.push(this.dskhuyenmai[i]);
              }
            }
          }
        }
      }
    }
    for (const i in arrKhuyenMai) {
      if (arrKhuyenMai.hasOwnProperty(i)) {
        if (giatrikhuyenmai < arrKhuyenMai[i].Gia_tri) {
          giatrikhuyenmai = arrKhuyenMai[i].Gia_tri;
          this.arrgiatrikhuyenmai[index] = arrKhuyenMai[i].Gia_tri
        }
      }
    }
  }

  //?????i tr???ng th??i
  async DoiTrangThai(phieudat, index, content_change_status) {
    let sanphams = []
    this.phieudat = phieudat
    this.arrgiatrikhuyenmai = []
    if (this.Trang_thai[index] === 'Giao h??ng th??nh c??ng') {
      this.modalService.open(content_change_status, { ariaLabelledBy: 'modal-change-status-title', backdrop: 'static', keyboard: false });
    } else {
      phieudat.Trang_thai = this.Trang_thai[index]
      this.phieudatService.CapNhatPhieuDat(phieudat).subscribe(dt => { })
      for (const h in phieudat.San_Pham) {
        for (const j in this.dssanpham) {

          if (this.dssanpham[j]._id === phieudat.San_Pham[h].SanPham_id) {
            sanphams.push(this.dssanpham[j])
          }
        }
      }
      for (const i in sanphams) {
        this.arrgiatrikhuyenmai.push(0)
        await this.KiemTraSPKhuyenMai(sanphams[i], Number.parseInt(i))
      }
      this.phieudatService.GuiEmailPhieuDat(phieudat, this.arrgiatrikhuyenmai).subscribe(data => { })
    }
  }

  // Chuy???n phi???u ?????t th??nh h??a ????n b??n h??ng
  async TaoHoaDonBan() {
    this.hoadonban = new HoaDonBanHangModel()
    this.getthongtintaikhoan()
    this.hoadonban._id = this.phieudat._id
    this.hoadonban.NhanVien_id = this.taikhoan.Nhan_vien_id
    this.hoadonban.Dia_chi = this.phieudat.Dia_chi
    this.hoadonban.Ho_ten = this.phieudat.Ho_ten
    this.hoadonban.KhachHang_id = this.phieudat.KhachHang_id
    this.hoadonban.Ngay_cap_nhat = this.phieudat.Ngay_cap_nhat
    this.hoadonban.San_Pham = this.phieudat.San_Pham
    this.hoadonban.So_dien_thoai = this.phieudat.So_dien_thoai
    this.hoadonban.ThanhToan_id = this.phieudat.ThanhToan_id
    this.hoadonban.VanChuyen_id = this.phieudat.VanChuyen_id
    this.hoadonban.Tong_tien = this.phieudat.Tong_tien
    this.hoadonbanService.ThemHoaDonBanHang(this.hoadonban).subscribe()
    this.phieudatService.XoaPhieuDat(this.phieudat._id).subscribe()
    await this.CapNhatSoLuongSanPham()
    this.modalService.dismissAll();
    // location.reload()
  }

  //Kh??ng t???o h??a ????n b??n h??ng
  KhongTaoHoaDon() {
    this.phieudat = new PhieuDatModel()
    this.modalService.dismissAll()
  }

  // L???y th??ng tin s???n ph???m
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

  getdsHinhThucVanChuyen(dshoadon) {
    this.hinhthucvanchuyenService.getListHinhThucVanChuyen().subscribe((res: any) => {
      this.dshinhthucvanchuyen = res.hinhthucvanchuyens
      this.compareVanChuyen_id(dshoadon)
    })
  }

  getdsPhuongThucThanhToan(dshoadon) {
    this.phuongthucthanhtoanService.getListPhuongThucThanhToan().subscribe((res: any) => {
      this.dsphuongthucthanhtoan = res.phuongthucthanhtoans;
      this.compareThanhToan_id(dshoadon)
    })
  }

  // T??m ?????i t?????ng so kh???p
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

  // T??m ?????i t?????ng so kh???p
  compareThanhToan_id(dshoadon) {
    this.thongtinthanhtoan = []
    for (const dmn in dshoadon) {
      for (const sp in this.dsphuongthucthanhtoan) {
        if (dshoadon[dmn].ThanhToan_id === this.dsphuongthucthanhtoan[sp]._id) {
          this.thongtinthanhtoan.push(this.dsphuongthucthanhtoan[sp])
        }
      }
    }
  }

  // T??m ?????i t?????ng so kh???p
  compareVanChuyen_id(dshoadon) {
    this.thongtinvanchuyen = []
    for (const dmn in dshoadon) {
      for (const sp in this.dshinhthucvanchuyen) {
        if (dshoadon[dmn].VanChuyen_id === this.dshinhthucvanchuyen[sp]._id) {
          this.thongtinvanchuyen.push(this.dshinhthucvanchuyen[sp])
        }
      }
    }
  }

  // H??m l???y th??ng tin th??nh ph???
  geteachDiaDiem() {
    this.diachiService.getListDiaChi().subscribe((res: any) => {
      this.thanhphos = res;
    });
  }

  // H??m h??? tr??? hi???n th??? list Th??nh ph??? trong th??? select  + ki???m tra ???? ch???n t???nh th??nh ph??? ch??a
  ThanhPho(e?, diachi?) {
    // X??a m???ng truy xu???t qu???n huy???n ban ?????u ????? b???t ?????u m???ng m???i
    this.arrquanhuyen1.splice(0, this.arrquanhuyen1.length);
    this.quanhuyens.splice(0, this.quanhuyens.length);
    // Clear l???i x?? ph?????ng
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    this.xaphuongs.splice(0, this.xaphuongs.length);
    if (e === null) {
      for (const qh in this.thanhphos) {
        if (this.thanhphos.hasOwnProperty(qh)) {
          if (this.thanhphos[qh].name === diachi.Tinh_ThanhPho) {
            this.arrquanhuyen1.push(this.thanhphos[qh].districts);
            for (const arr2 in this.arrquanhuyen1[0]) {
              if (this.arrquanhuyen1[0].hasOwnProperty(arr2)) {
                if (this.arrquanhuyen1[0][arr2].name === diachi.Huyen_Quan) {
                  this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
                }
              }
            }
            this.arrxaphuong.push(this.quanhuyens[0].wards);
            for (const arr in this.arrxaphuong[0]) {
              if (this.arrxaphuong[0].hasOwnProperty(arr)) {
                if (this.arrxaphuong[0][arr].name === diachi.Xa_Phuong) {
                  this.xaphuongs.push(this.arrxaphuong[0][arr]);
                }
              }
            }
          }
        }
      }
      this.HienThiQuanHuyen_XaPhuong(null, diachi);
    }
    else {
      this.phieudat.Dia_chi.Huyen_Quan = '';
      this.phieudat.Dia_chi.Xa_Phuong = '';
      e.preventDefault();
      const target = e.target;
      this.thanhpho = target.value;
      for (const qh in this.thanhphos) {
        if (this.thanhphos.hasOwnProperty(qh)) {
          if (this.thanhphos[qh].name === this.thanhpho) {
            this.arrquanhuyen1.push(this.thanhphos[qh].districts);
            for (const arr2 in this.arrquanhuyen1[0]) {
              if (this.arrquanhuyen1[0].hasOwnProperty(arr2)) {
                this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
              }
            }
          }
        }
      }
    }
  }

  //H???y th??m s???n ph???m
  Huy() {
    this.lstsanpham.splice(0, this.lstsanpham.length)
    this.modalService.dismissAll()
  }

  HienThiQuanHuyen_XaPhuong(evt, diachi) {
    // X??a m???ng truy xu???t qu???n huy???n ban ?????u ????? b???t ?????u m???ng m???i
    this.arrquanhuyen1.splice(0, this.arrquanhuyen1.length);
    this.quanhuyens.splice(0, this.quanhuyens.length);
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    this.xaphuongs.splice(0, this.xaphuongs.length);
    for (const qh in this.thanhphos) {
      if (this.thanhphos.hasOwnProperty(qh)) {
        if (this.thanhphos[qh].name === diachi.Tinh_ThanhPho) {
          this.arrquanhuyen1.push(this.thanhphos[qh].districts);
          for (const arr2 in this.arrquanhuyen1[0]) {
            if (this.arrquanhuyen1[0].hasOwnProperty(arr2)) {
              this.quanhuyens.push(this.arrquanhuyen1[0][arr2]);
            }
          }
        }
      }
    }
    for (const xp in this.quanhuyens) {
      if (this.quanhuyens.hasOwnProperty(xp)) {
        if (this.quanhuyens[xp].name === diachi.Huyen_Quan) {
          this.arrxaphuong.push(this.quanhuyens[xp].wards);
          for (const arr2 in this.arrxaphuong[0]) {
            if (this.arrxaphuong[0].hasOwnProperty(arr2)) {
              this.xaphuongs.push(this.arrxaphuong[0][arr2]);
            }
          }
        }
      }
    }
  }

  // H??m hi???n th??? qu???n huy???n t????ng ???ng th??nh ph??? + ki???m tra ???? ch???n qu???n huy???n ch??a
  QuanHuyen(e) {
    this.phieudat.Dia_chi.Xa_Phuong = '';
    this.xaphuongs.splice(0, this.xaphuongs.length);
    this.arrxaphuong.splice(0, this.arrxaphuong.length);
    e.preventDefault();
    const target = e.target;
    this.quanhuyen = target.value;
    if (this.quanhuyen !== '') {
      for (const xp in this.quanhuyens) {
        if (this.quanhuyens.hasOwnProperty(xp)) {
          if (this.quanhuyens[xp].name === this.quanhuyen) {
            this.arrxaphuong.push(this.quanhuyens[xp].wards);
            for (const arr2 in this.arrxaphuong[0]) {
              if (this.arrxaphuong[0].hasOwnProperty(arr2)) {
                this.xaphuongs.push(this.arrxaphuong[0][arr2]);
              }
            }
          }
        }
      }
    } else {
      this.xaphuongs.splice(0, this.xaphuongs.length);
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
    this.dsphieudat = this.dsphieudatsearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdsphieudat();
    } else {
      this.dsphieudat = this.dsphieudat.filter(res => {
        const khachhang = this.removeAccents(res.KhachHang_id);
        const hoten = this.removeAccents(res.Ho_ten);
        const maso = this.removeAccents(res._id);
        const tmp2 = text.replace(/??/g, '');
        if (khachhang.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return khachhang.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        } else {
          if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
            return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
          } else {
            if (hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
              return hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
            }
          }
        }
      });
    }
  }

  SearchByOption(value) {
    this.dsphieudat = this.dsphieudatsearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'C?? nh???t') {
      this.thongtinsanpham = []
      this.thongtinthanhtoan = []
      this.thongtinvanchuyen = []
      this.getdsphieudat();
    } else {
      if (target === 'M???i nh???t') {
        this.dsphieudat.reverse();
        this.thongtinsanpham.reverse()
        this.thongtinthanhtoan.reverse()
        this.thongtinvanchuyen.reverse()
      }
      this.ChuyenTrang(this.p)
    }
  }

  open(content) {
    this.UnChecked();
    this.phieudat = new PhieuDatModel()
    this.phieudat.Dia_chi = { Tinh_ThanhPho: '', Huyen_Quan: '', Xa_Phuong: '' };
    this.phieudat.San_Pham = [{ SanPham_id: '', So_luong: 0, Gia_ban: 0 }]
    this.vanchuyentmp = []
    this.thanhtoantmp = []
    this.IDKhachHang = []
    this.lstsanpham = []
    this.arrSanPhamReload = []
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, size: 'lg' });
  }

  open_update(content_update, eachPhieuDat, index_update) {
    // L??u ch??? s??? phi???u ?????t ???????c update
    this.index_update = index_update,
      this.UnChecked();
    this.phieudat = eachPhieuDat
    this.phieudat.Dia_chi = eachPhieuDat.Dia_chi[0];
    // G??n h??nh th???c v???n chuy???n cho dropdown
    for (const i in this.dshinhthucvanchuyen) {
      if (this.dshinhthucvanchuyen[i]._id === this.phieudat.VanChuyen_id) {
        this.vanchuyentmp.push(this.dshinhthucvanchuyen[i])
      }
    }
    // G??n h??nh th???c thanh to??n cho dropdown
    for (const i in this.dsphuongthucthanhtoan) {
      if (this.dsphuongthucthanhtoan[i]._id === this.phieudat.ThanhToan_id) {
        this.thanhtoantmp.push(this.dsphuongthucthanhtoan[i])
      }
    }
    this.lstsanpham = eachPhieuDat.San_Pham
    this.ThongTinSanPham(this.lstsanpham)
    this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false, size: 'lg' });
    this.ThanhPho(null, this.phieudat.Dia_chi);

  }

  open_delete(content_delete, _id) {
    if (_id != null) {
      this.UnChecked();
      this.phieudatID = _id;
      this.isdelete = false;
    } else {
      this.isdelete = true;
    }
    this.modalService.open(content_delete, { ariaLabelledBy: 'modal-basic-title-notification', backdrop: 'static', keyboard: false });
  }

  // Th???c hi???n x??a sau khi x??c nh???n Dialog
  XacNhan() {
    if (this.isdelete === true) {
      this.XoaNhieuPhieuDat();
    } else {
      this.XoaPhieuDat(this.phieudatID);
    }
    this.modalService.dismissAll();
  }

  // H??m x??a nhi???u
  XoaNhieuPhieuDat() {
    this.PhieuDatChecked();
    this.phieudatService.XoaNhieuPhieuDat(this.arrPhieuDat_ID).subscribe(data_xoanhieu => {
      if (JSON.stringify(data_xoanhieu) === '"X??a phi???u ?????t th??nh c??ng!"') {
        this.modalService.dismissAll()
        this.KTCheckedAll()
        this.UnChecked()
      } else {
        window.alert(data_xoanhieu);
      }
    });
  }

  XoaPhieuDat(_id: string) {
    this.phieudatService.XoaPhieuDat(_id).subscribe(data_xoa => {
    });
  }

  open_product_plus(content_info_product_plus) {
    this.So_luong = 0
    this.Gia_ban = 0;
    this.sanphamtmp = []
    this.dsSP = new SanPhamThemModel()
    this.modalService.open(content_info_product_plus, {
      ariaLabelledBy: 'modal-basic-title-info-mail-plus',
      backdrop: 'static', keyboard: false
    });
  }

  open_list_product_update(content_info_product_update) {
    this.So_luong = 0
    this.Gia_ban = 0;
    this.sanphamtmp = []
    this.dsSP = new SanPhamThemModel()
    this.modalService.open(content_info_product_update, {
      ariaLabelledBy: 'modal-basic-title-info-mail-update',
      backdrop: 'static', keyboard: false
    });
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
      for (let i = 0; i < this.dsphieudat.length; i++) {
        this.checked.push(false);
        document.getElementById('divbutton').style.display = 'none';
      }
    } else {
      this.checkAll = true;
      this.checked = [];
      for (let i = 0; i < this.dsphieudat.length; i++) {
        this.checked.push(true);
        document.getElementById('divbutton').style.display = 'block';
      }
    }
  }

  // M??ng  ???????c check
  PhieuDatChecked() {
    this.arrPhieuDat_ID = [];
    for (const kt in this.checked) {
      if (this.checked.hasOwnProperty(kt)) {
        if (this.checked[kt] === true) {
          this.arrPhieuDat_ID.push(this.dsphieudat[kt]._id);
        }
      }
    }
  }

  // H??m ki???m tra s???n ph???m n??y ???? ???????c nh???p ch??a
  KiemTraTrungSanPham(sp) {
    let bool = false
    if (this.lstsanpham[0] === undefined) {
      bool = true
      return bool
    } else {
      for (const i in this.lstsanpham) {
        for (const j in sp) {
          if (this.lstsanpham[i].SanPham_id === sp[j]._id) {
            bool = false
            return bool
          } else {
            bool = true
          }
        }

      }
      return bool

    }

  }

  // H??m ki???m tra th??ng tin
  KTNull(pd: PhieuDatModel) {
    if (this.thanhtoantmp[0] !== undefined && this.vanchuyentmp[0] !== undefined) {
      this.phieudat.ThanhToan_id = this.thanhtoantmp[0]._id
      this.phieudat.VanChuyen_id = this.vanchuyentmp[0]._id
      const _idKH = this.phieudat.KhachHang_id
      const hoten = this.phieudat.Ho_ten;
      const diachi = this.phieudat.Dia_chi;
      const sdt = this.phieudat.So_dien_thoai;
      const hinhthucvanchuyen = this.phieudat.VanChuyen_id;
      const phuongthucthanhtoan = this.phieudat.ThanhToan_id;
      const sanpham = this.phieudat.San_Pham[0]
      const thongtinphieudat = [];
      thongtinphieudat.push(_idKH, hoten, diachi.Tinh_ThanhPho, diachi.Huyen_Quan,
        diachi.Xa_Phuong, sdt, hinhthucvanchuyen, phuongthucthanhtoan);
      for (const i in thongtinphieudat) {
        if (thongtinphieudat.hasOwnProperty(i)) {
          if (thongtinphieudat[i] === '' || thongtinphieudat[i] === undefined || thongtinphieudat[i] === null) {
            window.alert('H??y nh???p ?????y ????? th??ng tin!');
            this.KiemTraThongTin = false;
            break;
          } else {
            this.KiemTraThongTin = true;
          }
        }
      }
      if (sanpham === undefined || sanpham === null) {
        document.getElementById('errListSanPham').style.display = 'block'
        this.KiemTraThongTin = false;
      } else {
        document.getElementById('errListSanPham').style.display = 'none'
      }
    }

  }

  // C???p nh???t danh s??ch s???n ph???m trong update
  CapNhatDSSanPham(content_update) {
    if (this.sanphamtmp[0] === undefined || this.So_luong <= 0) {
      alert('Vui l??ng nh???p ?????y ????? th??ng tin!')
    } else {
      if (this.KiemTraTrungSanPham(this.sanphamtmp)) {
        for (const i in this.sanphamtmp) {
          this.dsSP.SanPham_id = this.sanphamtmp[i]._id
          this.dsSP.Ten_san_pham = this.sanphamtmp[i].Ten_san_pham
          this.dsSP.So_luong = this.So_luong
          for (const j in this.dssanpham) {
            if (this.dssanpham[j]._id === this.sanphamtmp[i]._id) {
              this.dsSP.Gia_ban = this.dssanpham[j].Gia
            }
          }
        }

        this.sanphamService.getListSanPham().subscribe((res: any) => {
          this.sanphams = res.sanphams
          for (const j in this.sanphams) {
            if (this.sanphams[j]._id === this.dsSP.SanPham_id) {
              if (this.sanphams[j].So_luong < this.dsSP.So_luong) {
                document.getElementById('errSoLuongMax').style.display = 'block'
                this.dsSP = new SanPhamThemModel()
              } else {
                document.getElementById('errSoLuongMax').style.display = 'none'
                this.lstsanpham.push(this.dsSP)
                this.ThongTinSanPham(this.lstsanpham)
                this.dsSP = new SanPhamThemModel()
                this.So_luong = 0
                this.modalService.dismissAll()
                this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false, size: 'lg' });
              }
            }
          }
        })
      } else {
        alert('S???n ph???m n??y ???? ???????c th??m v??o danh s??ch!')
      }
    }
  }

  ThongTinSanPham(lstSanPham) {
    this.arrSanPhamReload = []
    for (const j in lstSanPham) {
      for (const i in this.dssanpham) {
        if (this.dssanpham[i]._id === this.lstsanpham[j].SanPham_id) {
          this.arrSanPhamReload.push(this.dssanpham[i])
          this.arrSanPhamReload[j].So_luong = this.lstsanpham[j].So_luong
          break
        }
      }

    }
  }

  // Th??m s???n ph???m v??o list
  ThemSanPham(content) {
    if (this.sanphamtmp[0] === undefined || this.So_luong <= 0) {
      alert('Vui l??ng nh???p ?????y ????? th??ng tin!')
    } else {
      if (this.KiemTraTrungSanPham(this.sanphamtmp)) {
        for (const i in this.sanphamtmp) {
          this.dsSP.SanPham_id = this.sanphamtmp[i]._id
          this.dsSP.Ten_san_pham = this.sanphamtmp[i].Ten_san_pham
          this.dsSP.So_luong = this.So_luong
        }
        this.sanphamService.getListSanPham().subscribe((res: any) => {
          this.sanphams = res.sanphams
          for (const j in this.sanphams) {
            if (this.sanphams[j]._id === this.dsSP.SanPham_id) {
              if (this.sanphams[j].So_luong < this.dsSP.So_luong) {
                document.getElementById('errSoLuongMax').style.display = 'block'
                this.dsSP = new SanPhamThemModel()
              } else {
                document.getElementById('errSoLuongMax').style.display = 'none'
                this.lstsanpham.push(this.dsSP)
                this.ThongTinSanPham(this.lstsanpham)
                this.dsSP = new SanPhamThemModel()
                this.So_luong = 0
                this.modalService.dismissAll()
                this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, size: 'lg' });
              }
            }
          }
          this.ThongTinSanPham(this.lstsanpham)
        })
      } else {
        alert('S???n ph???m n??y ???? ???????c th??m v??o danh s??ch!')
      }
    }
  }

  // Th??m h??a ????n
  async ThemPhieuDat() {
    let khachhang = new KhachHangModel()
    let sum = 0
    // let sanphams = []
    this.arrgiatrikhuyenmai = []
    if (this.IDKhachHang[0] !== undefined) {
      for (const i in this.dskhachhang) {
        if (this.dskhachhang[i].Khach_hang_id === this.IDKhachHang[0].Khach_hang_id) {
          khachhang = this.dskhachhang[i]
          break
        }
      }
      this.getthongtintaikhoan()
      this.phieudat.KhachHang_id = khachhang.Khach_hang_id
      this.phieudat.Ho_ten = khachhang.Ho_ten
      this.phieudat.So_dien_thoai = khachhang.So_dien_thoai
      this.phieudat.Trang_thai = '???? duy???t'
      this.phieudat.San_Pham.splice(0, this.phieudat.San_Pham.length)
      for (const i in this.arrSanPhamReload) {
        this.arrgiatrikhuyenmai.push(0)
        for (const j in this.dssanpham) {

          if (this.arrSanPhamReload[i]._id === this.dssanpham[j]._id) {
            this.phieudat.San_Pham.push({ SanPham_id: this.dssanpham[j]._id, So_luong: this.arrSanPhamReload[i].So_luong, Gia_ban: this.dssanpham[j].Gia })
            await this.KiemTraSPKhuyenMai(this.dssanpham[j], Number.parseInt(i))

          }
        }
      }
      for (const s in this.phieudat.San_Pham) {
        sum += this.phieudat.San_Pham[s].So_luong * (this.phieudat.San_Pham[s].Gia_ban - this.phieudat.San_Pham[s].Gia_ban * this.arrgiatrikhuyenmai[s])
      }

      this.phieudat.Tong_tien = sum

      if (this.vanchuyentmp[0] !== undefined && this.thanhtoantmp[0] !== undefined) {
        this.phieudat.VanChuyen_id = this.vanchuyentmp[0]._id
        for (const i in this.dshinhthucvanchuyen) {
          if (this.dshinhthucvanchuyen[i]._id === this.vanchuyentmp[0]._id) {
            this.phieudat.Tong_tien += this.dshinhthucvanchuyen[i].Gia
          }
        }
        this.phieudat.ThanhToan_id = this.thanhtoantmp[0]._id
      }
      this.KTNull(this.phieudat)
      if (this.KiemTraThongTin) {
        this.phieudatService.ThemPhieuDat(this.phieudat).subscribe(dt => {
          if (JSON.stringify(dt) === '"T???o phi???u ?????t th??nh c??ng!"') {
            this.modalService.dismissAll()
          }
          else {
            window.alert(dt);
            this.phieudat.San_Pham = [{ SanPham_id: '', So_luong: 0, Gia_ban: 0 }]
            this.lstsanpham.splice(0, this.lstsanpham.length)
            this.modalService.dismissAll()
          }
        })
      }
    }

  }


  // C???p nh???t phi???u ?????t
  async CapNhat() {
    this.sum = 0
    this.phieudat.San_Pham.splice(0, this.phieudat.San_Pham.length)
    for (const i in this.arrSanPhamReload) {
      for (const j in this.dssanpham) {
        if (this.arrSanPhamReload[i]._id === this.dssanpham[j]._id) {
          this.phieudat.San_Pham.push({ SanPham_id: this.dssanpham[j]._id, So_luong: this.arrSanPhamReload[i].So_luong, Gia_ban: this.dssanpham[j].Gia })
          await this.KiemTraSPKhuyenMai(this.dssanpham[j], Number.parseInt(i))
        }
      }
    }
    for (const s in this.phieudat.San_Pham) {
      this.sum += this.phieudat.San_Pham[s].So_luong * (this.phieudat.San_Pham[s].Gia_ban - this.phieudat.San_Pham[s].Gia_ban * this.arrgiatrikhuyenmai[s])
    }
    this.phieudat.Tong_tien = this.sum
    this.KTNull(this.phieudat);
    for (const i in this.dshinhthucvanchuyen) {
      if (this.dshinhthucvanchuyen[i]._id === this.vanchuyentmp[0]._id) {
        this.phieudat.Tong_tien += this.dshinhthucvanchuyen[i].Gia
      }
    }
    if (this.KiemTraThongTin) {
      this.phieudatService.CapNhatPhieuDat(this.phieudat).subscribe(dt => {
        if (JSON.stringify(dt) === '"C???p nh???t phi???u ?????t th??nh c??ng!"') {
          if (this.phieudat.Trang_thai === 'Giao h??ng th??nh c??ng') {
            this.TaoHoaDonBan()
          }
          this.modalService.dismissAll()
        } else {
          window.alert(dt);
        }
      })
    }

  }

  // Update s??? l?????ng S???n ph???m
  CapNhatSoLuongSanPham() {
    let so_luong;
    let arr_sp = [];
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.sanphams = res.sanphams
      for (const i in this.phieudat.San_Pham) {
        for (const j in this.sanphams) {
          if (this.phieudat.San_Pham[i].SanPham_id === this.sanphams[j]._id) {
            so_luong = this.sanphams[j].So_luong - this.phieudat.San_Pham[i].So_luong
            this.sanphams[j].So_luong = so_luong
            arr_sp.push(this.sanphams[j])
          }
        }
      }
      this.sanphamService.CapNhatSoLuongSanPham(arr_sp).subscribe()

    })
  }

  // ????ng dialog
  DongModal() {
    this.modalService.dismissAll();
  }

  open_product_update(content_product_update, sp, index) {
    this.sanphamtmp = []
    this.flag = index
    this.sanphamtmp.push(sp)
    this.So_luong = this.lstsanpham[index].So_luong
    this.modalService.open(content_product_update, { ariaLabelledBy: 'modal-basic-title-product-update', backdrop: 'static', keyboard: false })
    this.ErrMessage()
  }

  open_product_update2(content_product_update2, sp, index) {
    this.sanphamtmp = []
    this.flag = index
    this.sanphamtmp.push(sp)

    this.So_luong = this.lstsanpham[index].So_luong
    this.modalService.open(content_product_update2, { ariaLabelledBy: 'modal-basic-title-product-update2', backdrop: 'static', keyboard: false })
    this.ErrMessage()
  }

  ErrMessage() {
    if (this.sanphamtmp[0] === undefined) {
      document.getElementById('errSanPham').style.display = 'block'
    } else {
      document.getElementById('errSanPham').style.display = 'none'
    }

    if (this.So_luong <= 0) {
      document.getElementById('errSoLuong').style.display = 'block'
    } else {
      document.getElementById('errSoLuong').style.display = 'none'
    }

  }

  //H??m l???y ch??? s??? s???n ph???m
  SanPhamIndex(sp) {
    let index;
    for (const i in this.lstsanpham) {
      for (const j in sp) {
        if (this.lstsanpham[i].SanPham_id === sp[j]._id) {
          // N???u t???n t???i th?? tr??? v??? ch??? s???

          index = i
          return index
        } else {
          // Kh??ng t???n t???i th?? tr??? v??? -1
          index = -1
        }
      }
    }
    return index
  }

  // Ch???nh s???a s???n ph???m khi c???p nh???t
  ChinhSuaSanPham(content_update) {
    if (this.sanphamtmp[0] === undefined || this.So_luong <= 0) {
      alert('Vui l??ng nh???p ?????y ????? th??ng tin!')
    } else {

      // L???y ch??? s??? s???n ph???m tr??ng
      const index = this.SanPhamIndex(this.sanphamtmp)
      // = -1 l?? ch??a c?? trong lstsanpham => c?? th??? c???p nh???t
      if (index === -1) {
        this.lstsanpham[Number.parseInt(this.flag)].So_luong = this.So_luong
        this.lstsanpham[Number.parseInt(this.flag)].Ten_san_pham = this.sanphamtmp[0].Ten_san_pham
        this.lstsanpham[Number.parseInt(this.flag)].SanPham_id = this.sanphamtmp[0]._id
      }
      else {
        // Ki???m tra n???u tr??ng t???i v??? tr?? ??ang c???p nh???t th?? cho ph??p c???p nh???t
        if (index.toString() === this.flag.toString()) {
          this.lstsanpham[Number.parseInt(this.flag)].So_luong = this.So_luong
          this.lstsanpham[Number.parseInt(this.flag)].Ten_san_pham = this.sanphamtmp[0].Ten_san_pham
          this.lstsanpham[Number.parseInt(this.flag)].SanPham_id = this.sanphamtmp[0]._id
        } else {
          // N???u tr??ng ??? document kh??c th?? kh??ng cho c???p nh???t
          alert('S???n ph???m n??y ???? c?? trong phi???u ?????t')

        }
      }
      this.ThongTinSanPham(this.lstsanpham)
      this.sanphamService.getListSanPham().subscribe((res: any) => {
        this.sanphams = res.sanphams
        for (const j in this.sanphams) {
          if (this.lstsanpham[Number.parseInt(this.flag)].SanPham_id === this.sanphams[j]._id) {

            if (this.lstsanpham[Number.parseInt(this.flag)].So_luong > this.sanphams[j].So_luong) {
              document.getElementById('errKhongDuSoLuong').style.display = 'block'
            } else {
              this.arrSanPhamReload[Number.parseInt(this.flag)].So_luong = this.lstsanpham[Number.parseInt(this.flag)].So_luong
              document.getElementById('errKhongDuSoLuong').style.display = 'none'
              this.modalService.dismissAll()
              this.modalService.open(content_update, { ariaLabelledBy: 'modal-basic-title-update', backdrop: 'static', keyboard: false, size: 'lg' });
            }
          }
        }
      })


    }

  }

  //Ch???nh s???a s???n ph???m khi th??m
  CapNhatListSanPham(content) {
    if (this.sanphamtmp[0] === undefined || this.So_luong <= 0) {
      alert('Vui l??ng nh???p ?????y ????? th??ng tin!')
    } else {
      // // L???y ch??? s??? s???n ph???m tr??ng
      const index = this.SanPhamIndex(this.sanphamtmp)
      // = -1 l?? ch??a c?? trong lstsanpham => c?? th??? c???p nh???t
      if (index === -1) {
        this.lstsanpham[Number.parseInt(this.flag)].So_luong = this.So_luong
        this.lstsanpham[Number.parseInt(this.flag)].Ten_san_pham = this.sanphamtmp[0].Ten_san_pham
        this.lstsanpham[Number.parseInt(this.flag)].SanPham_id = this.sanphamtmp[0]._id
      }
      else {
        // Ki???m tra n???u tr??ng t???i v??? tr?? ??ang c???p nh???t th?? cho ph??p c???p nh???t
        if (index.toString() === this.flag.toString()) {
          this.lstsanpham[Number.parseInt(this.flag)].So_luong = this.So_luong
          this.lstsanpham[Number.parseInt(this.flag)].Ten_san_pham = this.sanphamtmp[0].Ten_san_pham
          this.lstsanpham[Number.parseInt(this.flag)].SanPham_id = this.sanphamtmp[0]._id
        } else {
          // N???u tr??ng ??? document kh??c th?? kh??ng cho c???p nh???t
          alert('S???n ph???m n??y ???? c?? trong phi???u ?????t')

        }
      }
      this.ThongTinSanPham(this.lstsanpham)
      this.sanphamService.getListSanPham().subscribe((res: any) => {
        this.sanphams = res.sanphams
        for (const j in this.sanphams) {
          if (this.lstsanpham[Number.parseInt(this.flag)].SanPham_id === this.sanphams[j]._id) {

            if (this.lstsanpham[Number.parseInt(this.flag)].So_luong > this.sanphams[j].So_luong) {
              document.getElementById('errKhongDuSoLuong').style.display = 'block'
            } else {
              this.arrSanPhamReload[Number.parseInt(this.flag)].So_luong = this.lstsanpham[Number.parseInt(this.flag)].So_luong
              document.getElementById('errKhongDuSoLuong').style.display = 'none'
              this.modalService.dismissAll()
              this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, size: 'lg' });
            }
          }
        }
      })
    }
  }
  // Xo?? s???n ph???m trong danh s??ch
  XoaDSSanPham(content, _id, index, type?) {

    this.arrSanPhamReload.splice(Number.parseInt(index), 1)
    if (type !== 'new') {
      this.dsphieudat[this.index_update].San_Pham.splice(Number.parseInt(index), 1)
      this.thongtinsanpham[this.index_update].splice(Number.parseInt(index), 1)

    } else {
      this.lstsanpham.splice(Number.parseInt(index), 1)
    }
    // for (const i in this.arrSanPham){
    if (this.arrSanPhamReload.length === 0) {
      document.getElementById('errListSanPham').style.display = 'block'
    } else {
      document.getElementById('errListSanPham').style.display = 'none'
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

  DetailSanPham(index, content_product_detail, eachPhieuDat) {
    this.thongtinchitietsanpham = this.thongtinsanpham[index]
    this.phieudatchitiet = eachPhieuDat
    this.modalService.open(content_product_detail, { ariaLabelledBy: 'modal-product-detail-title', backdrop: 'static', keyboard: false, size: 'lg' });

  }
}
