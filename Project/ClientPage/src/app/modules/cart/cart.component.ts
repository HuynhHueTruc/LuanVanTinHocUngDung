import { PhieuDatModel } from './../../../models/PhieuDat/phieudat';
import { PhieudatService } from './../../../services/PhieuDat/phieudat.service';
import { KhachhangService } from './../../../services/KhachHang/khachhang.service';


import { GioHangModel } from './../../../models/GioHang/giohang';
import { KhuyenmaiService } from 'src/services/KhuyenMai/khuyenmai.service';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { KhuyenMaiModel } from './../../../models/KhuyenMai/khuyenmai';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { Router } from '@angular/router';
import { GiohangService } from './../../../services/GioHang/giohang.service';
import { Component, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  message: string;
  href = '';
  sanpham_id;
  datalogin: any;

  dssanpham: SanPhamModel;
  sanphamdetail: SanPhamModel[] = [];
  dskhuyenmai: KhuyenMaiModel[] = [];
  arrKhuyenMai: KhuyenMaiModel[] = [];
  khuyenmai: KhuyenMaiModel;
  giohang: GioHangModel[] = [];
  sanphams: any;
  arrSanPham: SanPhamModel[] = [];

  checkAll = false;
  checked = [];
  lengthdssanpham = 0;
  lengthchecked = 0;
  tong_tien = 0;
  So_luong = 0;
  giatrikhuyenmai = 0;
  arrSanPhamThanhToan: any;
  sum = 0;
  dsphieudat: PhieuDatModel
  // arrSanPham_ID = [];
  constructor(private giohangService: GiohangService, private router: Router, private sanphamService: SanphamService,
    private khuyenmaiService: KhuyenmaiService, private KHService: KhachhangService, private phieudatService: PhieudatService) { }

  // private updateSubscription: Subscription;

  ngOnInit(): void {
    //     this.updateSubscription = interval(1000).subscribe(
    //       (val) => { this.getgiohang()
    //     }
    // );

    if (this.KHService.isLoggedIn) {
      this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
      this.href = this.router.url;
      this.sanpham_id = this.href.replace('/detail/', '');

      this.giohangService.getRefeshPage().subscribe(() => {
        this.getgiohang();
      })
      this.getgiohang();
    } else {
      this.router.navigateByUrl('/login');
    }

  }

  getgiohang() {
    this.giohang = []
    this.checked = []

    this.giohangService.getGioHang(this.datalogin).subscribe(dt => {
      this.giohang = dt;
      this.lengthdssanpham = this.giohang[0].San_Pham.length;
      for (const length in this.giohang[0].San_Pham) {
        if (this.giohang[0].San_Pham.hasOwnProperty(length)) {
          this.checked.push(false);
        }
      }
      this.getdssanpham();
    });
  }


  getdssanpham() {
    this.dssanpham = new SanPhamModel()
    this.arrSanPham = []
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;
      for (const j in this.giohang[0].San_Pham) {
        if (this.dssanpham.hasOwnProperty(j)) {
          for (const i in this.dssanpham) {
            if (this.giohang[0].San_Pham[j].SanPham_id === this.dssanpham[i]._id) {
              this.arrSanPham.push(this.dssanpham[i]);
            }
          }
        }
      }
      this.getdskhuyenmai();
    });
  }

  KiemTraSoLuongSanPham() {
    if (this.giohang[0]?.San_Pham[0] === undefined) {
      return false
    } else {
      return true
    }
  }


  // Lấy danh sách khuyến mãi
  getdskhuyenmai() {
    this.dskhuyenmai = []
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;

    });
  }

  // Mở Dialog xác nhận xóa giỏ hàng
  Xoa(index) {
    this.arrSanPham.splice(index, 1);
    this.giohang[0].San_Pham.splice(index, 1);
    this.giohangService.CapNhatSoLuong(this.giohang[0]).subscribe()
    this.TongTien()
    this.checked.splice(Number.parseInt(index), 1)
    this.lengthchecked = this.checked.length;
    this.lengthdssanpham = this.giohang[0].San_Pham.length;
    if (this.lengthdssanpham === 0) {
      this.checkAll = false
      document.getElementById('divbutton').style.display = 'none';
    }
  }



  XoaTatCa() {
    const tmp = []
    for (let i = 0; i < this.checked.length; i++) {
      if (this.checked[i]) {
        tmp.push(this.arrSanPham[i])
      }
    }
    for (const i in tmp) {
      for (const j in this.arrSanPham){
        if (tmp[i]._id === this.arrSanPham[j]._id){
          this.arrSanPham.splice(Number.parseInt(j), 1)
        }
      }
      for (const j in this.giohang[0].San_Pham){
        if (tmp[i]._id === this.giohang[0].San_Pham[j].SanPham_id){
          this.giohang[0].San_Pham.splice(Number.parseInt(j), 1)
        }
      }
    }    

    this.giohangService.CapNhatGioHang(this.giohang[0]).subscribe()
    this.checkAll = true
    this.KTCheckedAll()
    document.getElementById('divbutton').style.display = 'none';
  }


  // Hàm xử lý sự kiện checked tại ô checkbox tổng
  KTCheckedAll() {
    if (this.checkAll) {
      this.checkAll = false;
      this.arrSanPhamThanhToan = []
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

    if (this.checkAll) {
      this.TongTien()
      this.lengthchecked = this.checked.length;
    } else {
      this.tong_tien = 0;
      this.lengthchecked = 0
    }
  }

  // Bỏ chọn tất cả checkbox
  UnChecked() {
    this.checkAll = true;
    this.KTCheckedAll();
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
      console.log(this.lengthchecked)
      document.getElementById('divbutton').style.display = 'block';

    }
    this.TongTien()
  }


  TongTien() {
    this.tong_tien = 0;
    this.arrSanPhamThanhToan = []
    for (const i in this.arrSanPham) {
      this.KiemTraKhuyeMai(this.arrSanPham[i])
      this.tong_tien = this.tong_tien + (this.arrSanPham[i].Gia - this.arrSanPham[i].Gia * this.giatrikhuyenmai) * this.giohang[0].San_Pham[i].So_luong
      // this.arrSanPham[i].So_luong = this.giohang[0].San_Pham[i].So_luong
    }
    for (const j in this.arrSanPham) {
      if (!this.checked[j]) {
        this.KiemTraKhuyeMai(this.arrSanPham[j])
        this.tong_tien = this.tong_tien - (this.arrSanPham[j].Gia - this.arrSanPham[j].Gia * this.giatrikhuyenmai) * this.giohang[0].San_Pham[j].So_luong

      } else {
        this.arrSanPhamThanhToan.push(this.arrSanPham[j])
      }
    }
  }

  // Tăng số lượng sản phẩm đặt mua
  ThemSoLuong(index) {
    this.sum = 0;
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.dsphieudat = res.phieudats;

      for (const i in this.dsphieudat) {
        for (const j in this.dsphieudat[i].San_Pham) {
          if (this.arrSanPham[index]._id === this.dsphieudat[i].San_Pham[j].SanPham_id && this.dsphieudat[i].Trang_thai !== 'Chưa duyệt' && this.dsphieudat[i].Trang_thai !== 'Giao hàng thất bại') {
            this.sum += this.dsphieudat[i].San_Pham[j].So_luong
          }
        }
      }

      if (this.giohang[0].San_Pham[index].So_luong < this.arrSanPham[index].So_luong - this.sum) {
        this.giohang[0].San_Pham[index].So_luong += 1;
      } else {
        this.giohang[0].San_Pham[index].So_luong = this.arrSanPham[index].So_luong - this.sum;
      }
      this.giohangService.CapNhatSoLuong(this.giohang[0]).subscribe()
      this.TongTien()
    })
  }

  // Giảm số lượng sản phẩm đặt mua
  GiamSoLuong(index) {
    if (this.giohang[0].San_Pham[index].So_luong !== 1) {
      this.giohang[0].San_Pham[index].So_luong -= 1;
      this.giohangService.CapNhatSoLuong(this.giohang[0]).subscribe()
      this.TongTien()
    }
  }

  // Kiểm tra số lượng nhập vào thẻ input
  KiemTraSoLuong(index) {
    this.sum = 0;
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.dsphieudat = res.phieudats;

      for (const i in this.dsphieudat) {
        for (const j in this.dsphieudat[i].San_Pham) {
          if (this.arrSanPham[index]._id === this.dsphieudat[i].San_Pham[j].SanPham_id && this.dsphieudat[i].Trang_thai !== 'Chưa duyệt' && this.dsphieudat[i].Trang_thai !== 'Giao hàng thất bại') {
            this.sum += this.dsphieudat[i].San_Pham[j].So_luong
          }
        }
      }
      if (this.giohang[0].San_Pham[index].So_luong <= 0) {
        this.giohang[0].San_Pham[index].So_luong = null;
      } else {
        if (this.giohang[0].San_Pham[index].So_luong > this.arrSanPham[index].So_luong - this.sum) {
          this.So_luong_mac_dinh(index);
        }
        this.giohangService.CapNhatSoLuong(this.giohang[0]).subscribe()
        this.TongTien()
      }

    })



  }

  // Trả về số lượng mặt định khi con trỏ chuột nằm ngoài input trong khi giá trị input chưa hợp lệ
  So_luong_mac_dinh(index) {
    this.sum = 0;
    if (this.giohang[0].San_Pham[index].So_luong === null) {
      this.giohang[0].San_Pham[index].So_luong = 1;
    }
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.dsphieudat = res.phieudats;

      for (const i in this.dsphieudat) {
        for (const j in this.dsphieudat[i].San_Pham) {
          if (this.arrSanPham[index]._id === this.dsphieudat[i].San_Pham[j].SanPham_id && this.dsphieudat[i].Trang_thai !== 'Chưa duyệt' && this.dsphieudat[i].Trang_thai !== 'Giao hàng thất bại') {
            this.sum += this.dsphieudat[i].San_Pham[j].So_luong
          }
        }
      }
      if (this.giohang[0].San_Pham[index].So_luong > this.arrSanPham[index].So_luong - this.sum) {
        this.giohang[0].San_Pham[index].So_luong = this.arrSanPham[index].So_luong - this.sum;
      }
      this.giohangService.CapNhatSoLuong(this.giohang[0]).subscribe()
      this.TongTien()

    })



  }

  // Chọn khuyến mãi cao nhất của từng sản phẩm
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

  Checkout() {
    for (const i in this.arrSanPhamThanhToan) {
      for (const j in this.giohang[0].San_Pham) {
        if (this.arrSanPhamThanhToan[i]._id === this.giohang[0].San_Pham[j].SanPham_id) {
          this.arrSanPhamThanhToan[i].So_luong = this.giohang[0].San_Pham[j].So_luong
        }
      }
    }
    if (this.arrSanPhamThanhToan === undefined || this.arrSanPhamThanhToan[0] === undefined) {
      alert('Vui lòng chọn sản phẩm thanh toán!')
    } else {
      this.giohangService.setArrSP(this.arrSanPhamThanhToan)
      this.router.navigateByUrl('/checkout')
    }
  }
}
