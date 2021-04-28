import { KhuyenMaiModel } from './../../../models/KhuyenMai/khuyenmai';
import { KhuyenmaiService } from './../../../services/KhuyenMai/khuyenmai.service';
import { HoaDonBanHangModel } from './../../../models/HoaDonBanHang/hoadonbanhang';
import { HoadonbanhangService } from './../../../services/HoaDonBanHang/hoadonbanhang.service';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  href = '';
  sanpham_id;
  dssanpham: SanPhamModel;
  sanphamdetail: SanPhamModel[] = [];
  dskhuyenmai: KhuyenMaiModel[] = [];
  dshoadonban: HoaDonBanHangModel;
  SoLuongBan = 0;
  SoLuongDanhGia = 0;
  So_diem = 0;
  constructor(private router: Router, private sanphamService: SanphamService, private hoadonbanService: HoadonbanhangService,
              private khuyenmaiService: KhuyenmaiService) { }

  ngOnInit(): void {
    this.href = this.router.url;
    this.sanpham_id = this.href.replace('/detail/', '');
    this.getdssanpham();
  }

  getdssanpham() {
    let sd = 0;
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
        }
      }
      this.So_diem = sd / (this.sanphamdetail[0].Danh_gia.length);
      for (let i = 0; i < this.So_diem; i++) {
        document.getElementById(`star-${i + 1}`).style.color = 'yellow';
      }
      this.getdsHoaDonBanHang();
    });
  }

  getdsHoaDonBanHang() {
    let count = 0;
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
    });
  }

  // Lấy danh sách khuyến mãi
  getdskhuyenmai() {
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;
    });
  }

}
