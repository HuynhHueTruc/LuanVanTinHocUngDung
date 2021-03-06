import { PhieuDatModel } from './../../../models/PhieuDat/phieudat';
import { PhieudatService } from './../../../services/PhieuDat/phieudat.service';
import { KhachhangService } from './../../../services/KhachHang/khachhang.service';
import { LoaiCayModel } from './../../../models/LoaiCay/loaicay';
import { DanhMucModel } from './../../../models/DanhMuc/danhmuc';
import { LoaicayService } from './../../../services/LoaiCay/loaicay.service';
import { DanhmucService } from './../../../services/DanhMuc/danhmuc.service';
import { GiohangService } from './../../../services/GioHang/giohang.service';
import { GioHangModel } from './../../../models/GioHang/giohang';
import { ThongtincuahangService } from './../../../services/ThongTinCuaHang/thongtincuahang.service';
import { ThongTinCuaHangModel } from './../../../models/ThongTinCuaHang/thongtincuahang';
import { KhuyenMaiModel } from './../../../models/KhuyenMai/khuyenmai';
import { KhuyenmaiService } from './../../../services/KhuyenMai/khuyenmai.service';
import { HoaDonBanHangModel } from './../../../models/HoaDonBanHang/hoadonbanhang';
import { HoadonbanhangService } from './../../../services/HoaDonBanHang/hoadonbanhang.service';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { Router } from '@angular/router';
import { Component, OnInit, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit, AfterContentChecked {

  href = '';
  sanpham_id;
  datalogin: any;
  dssanpham: SanPhamModel;
  sanphamdetail: SanPhamModel[] = [];
  dskhuyenmai: KhuyenMaiModel[] = [];
  arrKhuyenMai: KhuyenMaiModel[] = [];
  dshoadonban: HoaDonBanHangModel;
  khuyenmai: KhuyenMaiModel;
  thongtincuahang: ThongTinCuaHangModel[] = [];
  giohang: GioHangModel[] = [];
  SoLuongBan = 0;
  SoLuongDanhGia = 0;
  So_diem = 0;
  giatrikhuyenmai = 0;
  url = '';
  img = '';
  index: any;
  arr_index: any;
  display = 'none';
  arrSoDiemConLai = [];
  countStar = [];
  isDisplay = [];
  arrHinhAnh = [];
  So_luong = 1;
  dscaycanh: SanPhamModel[] = [];
  danhmuc = ''
  arrSanPham: SanPhamModel[] = []
  danhmucloaicay: DanhMucModel
  loaicays: LoaiCayModel
  isLoading = false
  arrSoLuongBan = [];
  dsphieudat: PhieuDatModel
  sum = 0;
  arrSanPhamThanhToan = []
  constructor(private router: Router, private sanphamService: SanphamService, private hoadonbanService: HoadonbanhangService,
    private khuyenmaiService: KhuyenmaiService, private thongtincuahangService: ThongtincuahangService, private giohangService: GiohangService,
    private danhmucService: DanhmucService, private loaicayService: LoaicayService, private KHService: KhachhangService, private phieudatService: PhieudatService) { }

  ngOnInit(): void {
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.href = this.router.url;
    this.sanpham_id = this.href.replace('/detail/', '');
    this.getdssanpham();
    this.getgiohang();
  }

  ngAfterContentChecked(): void {
    // Called after every check of the component's or directive's content.
    // Add 'implements AfterContentChecked' to the class.
    if (this.isLoading) {
      window.location.reload();
    }
    this.isLoading = false;
  }

  getdsphieudat() {
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.dsphieudat = res.phieudats;
    })
  }

  getgiohang() {
    this.giohangService.getGioHang(this.datalogin).subscribe(dt => {
      this.giohang = dt;
    });
  }

  getdssanpham() {
    let sd = 0;
    // const arrImg = [];
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;
      for (const i in this.dssanpham) {
        if (this.dssanpham.hasOwnProperty(i)) {
          if (this.dssanpham[i]._id === this.sanpham_id) {
            this.sanphamdetail.push(this.dssanpham[i]);
          }
        }
      }

      this.SoLuongDanhGia = this.sanphamdetail[0].Danh_gia.length;
      for (const j in this.sanphamdetail[0].Danh_gia) {
        if (this.sanphamdetail[0].Danh_gia.hasOwnProperty(j)) {
          sd += this.sanphamdetail[0].Danh_gia[j].So_diem;
          this.arrSoDiemConLai.push(Array(5 - this.sanphamdetail[0].Danh_gia[j].So_diem)
            .fill(5 - this.sanphamdetail[0].Danh_gia[j].So_diem).map((x, i) => i));
          // ?????m sao v??ng
          this.countStar.push(Array(this.sanphamdetail[0].Danh_gia[j].So_diem).fill(this.sanphamdetail[0].Danh_gia[j].So_diem)
            .map((x, i) => i));
          this.arrHinhAnh.push(this.sanphamdetail[0].Danh_gia[j].Hinh_anh);
          this.isDisplay.push('none');

        }
      }
      this.So_diem = sd / (this.sanphamdetail[0].Danh_gia.length);
      for (let i = 0; i < this.So_diem; i++) {
        document.getElementById(`star-${i + 1}`).style.color = 'yellow';
      }



      this.getthongtincuahang();
      this.getdskhuyenmai();
      this.getdsHoaDonBanHang();
      // L???y danh m???c cu??? s???n ph???m v?? t??m s???n ph???m t????ng t???
      this.danhmuc = this.sanphamdetail[0].Danh_Muc[0].DMN_id
      for (const i in this.dssanpham) {
        if (this.dssanpham[i].Danh_Muc[0].DMN_id === this.danhmuc) {
          this.arrSanPham.push(this.dssanpham[i])
        }
      }

    });
  }

  getdsHoaDonBanHang() {
    let count = 0;
    let sum = 0
    this.hoadonbanService.getListHoaDonBan().subscribe((res: any) => {
      this.dshoadonban = res.hoadonbanhangs;
      for (const i in this.sanphamdetail) {
        if (this.sanphamdetail.hasOwnProperty) {
          for (const j in this.dshoadonban) {
            if (this.dshoadonban.hasOwnProperty) {
              for (const h in this.dshoadonban[j].San_Pham) {
                if (this.sanphamdetail[i]._id === this.dshoadonban[j].San_Pham[h].SanPham_id) {
                  count += this.dshoadonban[j].San_Pham[h].So_luong;
                }
              }
            }
          }
          this.SoLuongBan = count;
          count = 0;
        }
      }
      for (const i in this.arrSanPham) {
        if (this.arrSanPham.hasOwnProperty) {
          for (const j in this.dshoadonban) {
            if (this.dshoadonban.hasOwnProperty) {
              for (const h in this.dshoadonban[j].San_Pham) {
                if (this.arrSanPham[i]._id === this.dshoadonban[j].San_Pham[h].SanPham_id) {
                  sum += this.dshoadonban[j].San_Pham[h].So_luong;
                }
              }
            }
          }
          this.arrSoLuongBan.push({ SanPham_id: this.arrSanPham[i]._id, So_luong_ban: sum });
          sum = 0;
        }
      }
    });
  }

  // L???y danh s??ch khuy???n m??i
  getdskhuyenmai() {
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;
    });
  }

  getthongtincuahang() {
    this.thongtincuahangService.getBanner().subscribe((res: any) => {
      this.thongtincuahang = res.cuahangs;
    });
  }

  // Ch???n khuy???n m??i cao nh???t c???a t???ng s???n ph???m
  KiemTraKhuyeMai(eachSP) {
    this.arrKhuyenMai = [];
    this.giatrikhuyenmai = 0;
    let bool = false;
    for (const i in this.dskhuyenmai) {
      if (this.dskhuyenmai.hasOwnProperty(i)) {
        for (const j in this.dskhuyenmai[i].Danh_muc_nho) {
          if (this.dskhuyenmai[i].Danh_muc_nho.hasOwnProperty(j)) {
            if (this.dskhuyenmai[i].Danh_muc_nho[j].DMN_id === eachSP.Danh_Muc[0].DMN_id) {
              if (new Date(this.dskhuyenmai[i].Ngay_bat_dau).getTime() < new Date().getTime()
                && new Date(this.dskhuyenmai[i].Ngay_ket_thuc).getTime() > new Date().getTime()) {
                this.arrKhuyenMai.push(this.dskhuyenmai[i]);
              }
            } else {
              bool = false;
            }
          }
        }
      }
    }

    for (const i in this.arrKhuyenMai) {
      if (this.arrKhuyenMai.hasOwnProperty(i)) {
        if (this.giatrikhuyenmai < this.arrKhuyenMai[i].Gia_tri) {
          this.giatrikhuyenmai = this.arrKhuyenMai[i].Gia_tri;
          this.khuyenmai = this.arrKhuyenMai[i];
          bool = true;
        }
      }

    }
    // console.log(this.khuyenmai)
    return bool;
  }

  // Ph??ng to h??nh ???nh b??nh lu???n
  Zoom(url, index, arr_index) {
    this.index = index;
    this.arr_index = arr_index;
    this.url = this.arrHinhAnh[this.index][this.arr_index].url;
    for (let i = 0; i < this.isDisplay.length; i++) {
      if (i === index) {
        this.isDisplay[i] = 'block';
      }
      else {
        this.isDisplay[i] = 'none';

      }
    }
  }

  // Xem h??nh ???nh tr?????c h??nh ???nh ??ang xem
  HinhAnhTruoc() {
    if (this.arr_index > 0) {
      this.arr_index -= 1;
      this.url = this.arrHinhAnh[this.index][this.arr_index].url;
    }
  }

  // Xem h??nh ???nh sau h??nh ???nh ??ang xem
  HinhAnhSau() {
    // console.log(this.arrHinhAnh[this.index].length - 1, this.arr_index)
    if (this.arrHinhAnh[this.index].length - 1 > this.arr_index) {
      this.arr_index += 1;
      this.url = this.arrHinhAnh[this.index][this.arr_index].url;

    }
  }

  // T??ng s??? l?????ng s???n ph???m ?????t mua
  ThemSoLuong() {
    this.sum = 0;
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.dsphieudat = res.phieudats;
      for (const i in this.dsphieudat) {
        for (const j in this.dsphieudat[i].San_Pham) {
          if (this.sanphamdetail[0]._id === this.dsphieudat[i].San_Pham[j].SanPham_id && this.dsphieudat[i].Trang_thai !== 'Ch??a duy???t' && this.dsphieudat[i].Trang_thai !== 'Giao h??ng th???t b???i') {
            this.sum += this.dsphieudat[i].San_Pham[j].So_luong
          }
        }
      }

      if (this.So_luong < this.sanphamdetail[0].So_luong - this.sum) {
        this.So_luong += 1;

      } else {
        this.So_luong = this.sanphamdetail[0].So_luong - this.sum;
      }
    })
  }

  // Gi???m s??? l?????ng s???n ph???m ?????t mua
  GiamSoLuong() {
    if (this.So_luong !== 1) {
      this.So_luong -= 1;
    }
  }

  // Ki???m tra s??? l?????ng nh???p v??o th??? input
  KiemTraSoLuong() {
    const sl = document.getElementById('So_luong') as HTMLInputElement;
    this.sum = 0;
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.dsphieudat = res.phieudats;

      for (const i in this.dsphieudat) {
        for (const j in this.dsphieudat[i].San_Pham) {
          if (this.sanpham_id === this.dsphieudat[i].San_Pham[j].SanPham_id ) {
            this.sum += this.dsphieudat[i].San_Pham[j].So_luong
          }
        }
      }
      if (this.So_luong <= 0) {

        sl.value = '';
      }else{
        if(this.So_luong <=  (this.sanphamdetail[0].So_luong -  this.sum)){
          sl.value = this.So_luong.toString()
        }else{
          sl.value = (this.sanphamdetail[0].So_luong -  this.sum).toString();
        }
      }
    })

  }

  // Tr??? v??? s??? l?????ng m???t ?????nh khi con tr??? chu???t n???m ngo??i input trong khi gi?? tr??? input ch??a h???p l???
  So_luong_mac_dinh() {
    this.sum = 0;
    if (this.So_luong === null || this.So_luong === 0) {
      this.So_luong = 1;
    }

    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.dsphieudat = res.phieudats;

      for (const i in this.dsphieudat) {
        for (const j in this.dsphieudat[i].San_Pham) {
          if (this.sanphamdetail[0]._id === this.dsphieudat[i].San_Pham[j].SanPham_id ) {
            this.sum += this.dsphieudat[i].San_Pham[j].So_luong
          }
        }
      }
      if (this.So_luong > (this.sanphamdetail[0].So_luong - this.sum)) {
        this.So_luong = (this.sanphamdetail[0].So_luong - this.sum);
      }

    })
  }

  // C???p nh???t s??? l?????ng s???n ph???m n???u s???n ph???m ??ang th??m ???? t???n t???i trong gi??? h??ng
  CapNhatSoLuongSanPhamTrung(sanpham) {

    let bool = false
    for (const i in this.giohang[0].San_Pham) {
      if (this.giohang[0].San_Pham[i].SanPham_id === sanpham._id) {
        if ((this.giohang[0].San_Pham[i].So_luong + this.So_luong) > (this.sanphamdetail[0].So_luong - this.sum)) {
          this.giohang[0].San_Pham[i].So_luong = this.sanphamdetail[0].So_luong - this.sum

        } else {
          this.giohang[0].San_Pham[i].So_luong += this.So_luong
        }

        return true
      } else {
        bool = false
      }
    }
    return bool
  }

  ThemVaoGioHang() {
    if (this.KHService.loggedInStatus) {
      if (!this.CapNhatSoLuongSanPhamTrung(this.sanphamdetail[0])) {
        this.giohang[0].San_Pham.push({ SanPham_id: this.sanphamdetail[0]._id, So_luong: this.So_luong })
      }
      this.giohangService.CapNhatGioHang(this.giohang[0]).subscribe()
      alert('???? th??m v??o gi??? h??ng!')
    } else {
      this.router.navigateByUrl('/login');
    }

  }

  ProductDetail(eachSP) {
    this.router.navigateByUrl(`/detail/${eachSP._id}`);
    this.isLoading = true;
  }


  Checkout() {

    if (this.KHService.isLoggedIn) {
      this.arrSanPhamThanhToan = this.sanphamdetail
      this.arrSanPhamThanhToan[0].So_luong = this.So_luong

      this.giohangService.setArrSP(this.arrSanPhamThanhToan)
      this.router.navigateByUrl('/checkout')

    } else {
      this.router.navigateByUrl('/login')
    }

  }

}
