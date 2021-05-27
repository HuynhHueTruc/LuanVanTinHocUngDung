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

  sanphamchoxacnhan: AnhDaiDienModel[] = []
  sanphamcholayhang: AnhDaiDienModel[] = []
  sanphamdanggiaohang: AnhDaiDienModel[] = []
  sanphamdanhgia: AnhDaiDienModel[] = []

  soluongchoxacnhan = 0
  soluongcholayhang = 0
  soluongdanggiaohang = 0
  soluongdanhgia = 0

  arrdanhgia = []
  trang_thai = ''
  bellIconConfig: NbIconConfig = { icon: 'bell-outline', pack: 'eva' };

  constructor(private phieudatService: PhieudatService, private hoadonService: HoadonbanhangService, private sanphamService: SanphamService, private router: Router) { }

  ngOnInit(): void {
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.getdsphieudat()
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
        this.sanphamdanhgia.push(tmp)
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
        this.sanphamchoxacnhan.push(tmp)
        hinhanh = []
      }

      for (const k in this.dscholayhang) {
        for (const l in this.dscholayhang[k].San_Pham) {
          hinhanh.push({ SanPham_id: this.dscholayhang[k].San_Pham[l].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })
        }
        tmp = hinhanh
        this.sanphamcholayhang.push(tmp)
        hinhanh = []
      }

      for (const m in this.dsdanggiaohang) {
        for (const l in this.dsdanggiaohang[m].San_Pham) {
          hinhanh.push({ SanPham_id: this.dsdanggiaohang[m].San_Pham[l].SanPham_id, Hinh_anh: '', Ten_san_pham: '' })
        }
        tmp = hinhanh
        this.sanphamdanggiaohang.push(tmp)
        hinhanh = []
      }

      for (const j in this.dssanpham) {
        for (const h in this.sanphamdanhgia) {
          for (const k in this.sanphamdanhgia[h]) {
            if (this.sanphamdanhgia[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.sanphamdanhgia[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.sanphamdanhgia[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }

        }
        for (const h in this.sanphamchoxacnhan) {
          for (const k in this.sanphamchoxacnhan[h]) {
            if (this.sanphamchoxacnhan[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.sanphamchoxacnhan[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.sanphamchoxacnhan[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }
        }
        for (const h in this.sanphamcholayhang) {
          for (const k in this.sanphamcholayhang[h]) {
            if (this.sanphamcholayhang[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.sanphamcholayhang[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.sanphamcholayhang[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
            }
          }
        }
        for (const h in this.sanphamdanggiaohang) {
          for (const k in this.sanphamdanggiaohang) {
            if (this.sanphamdanggiaohang[h][k].SanPham_id === this.dssanpham[j]._id) {
              this.sanphamdanggiaohang[h][k].Hinh_anh = this.dssanpham[j].Hinh_anh
              this.sanphamdanggiaohang[h][k].Ten_san_pham = this.dssanpham[j].Ten_san_pham
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

  ChuyenTrangBinhLuan(eachPhieuDat) {
    this.router.navigateByUrl(`/comment/${eachPhieuDat._id}`);
  }

}
