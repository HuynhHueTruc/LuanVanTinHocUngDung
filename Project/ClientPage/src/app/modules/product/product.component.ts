import { HoaDonBanHangModel } from './../../../models/HoaDonBanHang/hoadonbanhang';
import { HoadonbanhangService } from './../../../services/HoaDonBanHang/hoadonbanhang.service';
import { KhuyenMaiModel } from './../../../models/KhuyenMai/khuyenmai';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { KhuyenmaiService } from 'src/services/KhuyenMai/khuyenmai.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  href = '';
  sanpham_id;
  dssanpham: SanPhamModel;
  arrsanpham: SanPhamModel[] = [];
  arrKhuyenMai: KhuyenMaiModel[] = [];
  khuyenmai: KhuyenMaiModel;
  arrSoLuongBan = [];
  giatrikhuyenmai = 0;
  dskhuyenmai: KhuyenMaiModel[] = [];
  dshoadonban: HoaDonBanHangModel;

  constructor(private router: Router, private sanphamService: SanphamService, private khuyenmaiService: KhuyenmaiService, private hoadonbanService: HoadonbanhangService) { }

  ngOnInit(): void {
    this.href = this.router.url;
    this.sanpham_id = this.href.replace('/default/product/', '');
    this.getdssanpham();
  }


  getdssanpham() {
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;

      for (const i in this.dssanpham) {
        if (this.dssanpham.hasOwnProperty) {
          if (this.dssanpham[i].Danh_Muc[0].DMN_id === this.sanpham_id) {
            this.arrsanpham.push(this.dssanpham[i]);
          }
        }
      }
      this.getdskhuyenmai();
      this.getdsHoaDonBanHang();
    });
  }

  // Lấy danh sách khuyến mãi
  getdskhuyenmai() {
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;
    });
  }

  getdsHoaDonBanHang() {
    let count = 0;
    this.hoadonbanService.getListHoaDonBan().subscribe((res: any) => {
      this.dshoadonban = res.hoadonbanhangs;
      for (const i in this.arrsanpham) {
        if (this.arrsanpham.hasOwnProperty) {
          for (const j in this.dshoadonban) {
            if (this.dshoadonban.hasOwnProperty){
              for (const h in this.dshoadonban[j].San_Pham){
                if (this.arrsanpham[i]._id === this.dshoadonban[j].San_Pham[h].SanPham_id){
                  count += this.dshoadonban[j].San_Pham[h].So_luong;
                }
              }
            }
          }
          this.arrSoLuongBan.push({SanPham_id: this.arrsanpham[i]._id, So_luong_ban: count});
          count = 0;
        }
      }
    });
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

  ProductDetail(eachSP){

    console.log(eachSP)
  }
}
