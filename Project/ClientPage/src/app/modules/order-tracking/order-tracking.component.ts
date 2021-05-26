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

  soluongchoxacnhan = 0
  soluongcholayhang = 0
  soluongdanggiaohnag = 0
  soluongdanhgia = 0

  arrdanhgia = []
  trang_thai = ''
  bellIconConfig: NbIconConfig = { icon: 'bell-outline', pack: 'eva' };

  constructor(private phieudatService: PhieudatService, private hoadonService: HoadonbanhangService, private sanphamService: SanphamService) { }

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
      this.soluongdanggiaohnag = this.dsdanggiaohang.length
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
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;

      for (const i in this.dsdanhgia) {
        for (const j in this.dsdanhgia[i].San_Pham) {
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
        this.arrdanhgia.push(count)
          count = 0
      }
      for (const n in this.arrdanhgia){
        if (this.arrdanhgia[n] === 0){
          this.soluongdanhgia += 1
        }
      }
      // console.log(this.dssanpham)
      // console.log(this.dsdanhgia)
      // console.log(this.arrdanhgia)

    })
  }

  KiemTraTrangThai(eachPhieuDat) {
    if (eachPhieuDat.Trang_thai === undefined) {
      this.trang_thai = 'Đã giao hàng thành công'
    }
    return true
  }

  KiemTraDanhGia() {

  }
}
