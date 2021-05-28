import { DanhGiaModel } from './../../../models/SanPham/danhgia';
import { Router } from '@angular/router';
import { AnhDaiDienModel } from './../../../models/SanPham/anhdaidien';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { HoaDonBanHangModel } from './../../../models/HoaDonBanHang/hoadonbanhang';
import { HoadonbanhangService } from './../../../services/HoaDonBanHang/hoadonbanhang.service';
import { PhieuDatModel } from './../../../models/PhieuDat/phieudat';
import { PhieudatService } from './../../../services/PhieuDat/phieudat.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NbIconConfig } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import firebase from 'firebase/app';
// import 'firebase/storage';
// import 'firebase/analytics';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {

  datalogin: any
  lstphieudat: PhieuDatModel
  lsthoadonbanhang: HoaDonBanHangModel
  dsphieudat: PhieuDatModel[] = []
  dsdanhgia: HoaDonBanHangModel[] = []
  dssanpham: SanPhamModel[] = []
  dsdonhang = []

  dschoxacnhan = []
  dscholayhang = []
  dsdanggiaohang = []

  dssanphamchoxacnhan: AnhDaiDienModel[] = []
  dssanphamcholayhang: AnhDaiDienModel[] = []
  dssanphamdanggiaohang: AnhDaiDienModel[] = []
  dssanphamdanhgia: AnhDaiDienModel[] = []

  soluongchoxacnhan = 0
  soluongcholayhang = 0
  soluongdanggiaohang = 0
  soluongdanhgia = 0

  danhgia: DanhGiaModel[] = []
  sanphamdanhgia: PhieuDatModel
  current: any
  arrdanhgia = []
  arrsodiem = []
  trang_thai = ''
  updateimg = false;


  bellIconConfig: NbIconConfig = { icon: 'bell-outline', pack: 'eva' };
 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  // firebaseConfig = {
  //   apiKey: "AIzaSyB5XhGTH_qmY-E5SKq0x9xvvadjtqPeXQQ",
  //   authDomain: "managementimagesgreenlife.firebaseapp.com",
  //   projectId: "managementimagesgreenlife",
  //   storageBucket: "managementimagesgreenlife.appspot.com",
  //   messagingSenderId: "206299427924",
  //   appId: "1:206299427924:web:63b6f139ee2c4d059f69c1",
  //   measurementId: "G-QZHVZRPBCT"
  // };

  constructor(private phieudatService: PhieudatService, private hoadonService: HoadonbanhangService, private sanphamService: SanphamService, private router: Router, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.getdsphieudat()
      // Initialize Firebase
      // if (!firebase.apps.length) {
      //   firebase.initializeApp(this.firebaseConfig);
      //   firebase.analytics();
      // } else {
      //   firebase.app(); // if already initialized, use that one
      // }
  }

  getdsphieudat() {
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.lstphieudat = res.phieudats;

      for (const i in this.lstphieudat) {
        if (this.lstphieudat[i].KhachHang_id === this.datalogin.Khach_hang_id) {
          this.dsphieudat.push(this.lstphieudat[i])
        }
      }

      for (const j in this.dsphieudat) {
        if (this.dsphieudat[j].Trang_thai === 'Chưa duyệt' || this.dsphieudat[j].Trang_thai === 'Giao hàng thất bại' || this.dsphieudat[j].Trang_thai === 'Đã hủy') {
          this.dschoxacnhan.push(this.dsphieudat[j])
        } else {
          if (this.dsphieudat[j].Trang_thai === 'Đã duyệt' || this.dsphieudat[j].Trang_thai === 'Đang được đóng gói'
            || this.dsphieudat[j].Trang_thai === 'Xuất kho' || this.dsphieudat[j].Trang_thai === 'Đang vận chuyển') {
            this.dscholayhang.push(this.dsphieudat[j])
          } else {
            if (this.dsphieudat[j].Trang_thai === 'Đang giao hàng') {
              this.dsdanggiaohang.push(this.dsphieudat[j])
            }
          }
        }
      }

      this.soluongchoxacnhan = this.dschoxacnhan.length
      this.soluongcholayhang = this.dscholayhang.length
      this.soluongdanggiaohang = this.dsdanggiaohang.length
      this.getdshoadon()
    })
  }

  getdshoadon() {
    this.hoadonService.getListHoaDonBan().subscribe((res: any) => {
      this.lsthoadonbanhang = res.hoadonbanhangs
      for (const i in this.lsthoadonbanhang) {
        if (this.lsthoadonbanhang[i].KhachHang_id === this.datalogin.Khach_hang_id) {
          this.dsdanhgia.push(this.lsthoadonbanhang[i])
        }
      }
      this.getdssanpham()
    })
  }

  getdssanpham() {
    let count = 0
    let hinhanh: AnhDaiDienModel[] = []
    let tmp: any
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;

      for (const i in this.dsdanhgia) {
        // Lấy ảnh đại diện cho đơn mua
        for (const j in this.dsdanhgia[i].San_Pham) {
          hinhanh.push({ SanPham_id: this.dsdanhgia[i].San_Pham[j].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })

          for (const k in this.dssanpham) {
            if (this.dsdanhgia[i].San_Pham[j].SanPham_id === this.dssanpham[k]._id) {
              for (const l in this.dssanpham[k].Danh_gia) {
                if (this.dssanpham[k].Danh_gia[l].KhachHang_id === this.datalogin.Khach_hang_id) {
                  count += 1
                }
              }
            }
          }
        }
        tmp = hinhanh
        this.dssanphamdanhgia.push(tmp)
        hinhanh = []
        this.arrdanhgia.push(count)
        count = 0
      }

      for (const n in this.arrdanhgia) {
        if (this.arrdanhgia[n] === 0) {
          this.soluongdanhgia += 1
        }
      }
      for (const l in this.dschoxacnhan) {
        for (const k in this.dschoxacnhan[l].San_Pham) {
          hinhanh.push({ SanPham_id: this.dschoxacnhan[l].San_Pham[k].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })
        }
        tmp = hinhanh
        this.dssanphamchoxacnhan.push(tmp)
        hinhanh = []
      }

      for (const k in this.dscholayhang) {
        for (const l in this.dscholayhang[k].San_Pham) {
          hinhanh.push({ SanPham_id: this.dscholayhang[k].San_Pham[l].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })
        }
        tmp = hinhanh
        this.dssanphamcholayhang.push(tmp)
        hinhanh = []
      }

      for (const m in this.dsdanggiaohang) {
        for (const l in this.dsdanggiaohang[m].San_Pham) {
          hinhanh.push({ SanPham_id: this.dsdanggiaohang[m].San_Pham[l].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })
        }
        tmp = hinhanh
        this.dssanphamdanggiaohang.push(tmp)
        hinhanh = []
      }

      for (const j in this.dssanpham) {
        for (const h in this.dssanphamdanhgia) {
          for (const k in this.dssanphamdanhgia[h]) {
            if (this.dssanphamdanhgia[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.dssanphamdanhgia[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.dssanphamdanhgia[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }

        }
        for (const h in this.dssanphamchoxacnhan) {
          for (const k in this.dssanphamchoxacnhan[h]) {
            if (this.dssanphamchoxacnhan[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.dssanphamchoxacnhan[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.dssanphamchoxacnhan[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }
        }
        for (const h in this.dssanphamcholayhang) {
          for (const k in this.dssanphamcholayhang[h]) {
            if (this.dssanphamcholayhang[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.dssanphamcholayhang[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.dssanphamcholayhang[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }
        }
        for (const h in this.dssanphamdanggiaohang) {
          for (const k in this.dssanphamdanggiaohang) {
            if (this.dssanphamdanggiaohang[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.dssanphamdanggiaohang[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.dssanphamdanggiaohang[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }
        }
      }
    })
  }

  KiemTraTrangThai(eachPhieuDat) {
    if (eachPhieuDat.Trang_thai === undefined) {
      this.trang_thai = 'Đã giao hàng thành công'
    }
    return true
  }

  ChiTietDonHang(eachPhieuDat) {
    this.router.navigateByUrl(`/bill_manegement/order_tracking_detail/${eachPhieuDat._id}`);
  }

  // Hàm mở Dialog Tạo
  open(content, eachPhieuDat, index) {

    this.sanphamdanhgia = new PhieuDatModel()
    this.sanphamdanhgia = eachPhieuDat
    this.current = index
    for (const j in this.sanphamdanhgia.San_Pham) {
      this.danhgia.push({ SanPham_id: this.sanphamdanhgia.San_Pham[j].SanPham_id, Noi_dung: '', Hinh_anh: '', KhachHang_id: this.datalogin.Khach_hang_id, So_diem: 0 })
      this.arrsodiem.push(0)
    }
    console.log(this.sanphamdanhgia)
    console.log(this.danhgia, this.arrsodiem)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false, size: 'lg' });
  }

  DemSoSao(index, count) {
    this.arrsodiem[index] = count
  }

   UpdateImg() {
    const f = document.querySelector('#imgcomment') as HTMLInputElement;
    const file = f.files;
    if (file === undefined) {
      this.updateimg = false
    } else {
      this.updateimg = true

    }
  }

  // CapNhatDanhGia() {
  //   if (this.updateimg) {
  //     this.CapNhatVaLuuDanhGia();
  //   }
  //     this.thongtincuahangService.updateThongTinCuaHang(this.thongtincuahang).subscribe(dt => {
  //       window.alert(dt);
  //       this.updateimg = false
  //     });

  // }

  // CapNhatVaLuuDanhGia(){

  // }

  DanhGia() {


  }

  Huy() {
    this.modalService.dismissAll();
  }
}
