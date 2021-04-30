import { ThongtincuahangService } from './../../../services/ThongTinCuaHang/thongtincuahang.service';
import { ThongTinCuaHangModel } from './../../../models/ThongTinCuaHang/thongtincuahang';
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
  arrKhuyenMai: KhuyenMaiModel[] = [];
  dshoadonban: HoaDonBanHangModel;
  khuyenmai: KhuyenMaiModel;
  thongtincuahang: ThongTinCuaHangModel[] = [];
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
  constructor(private router: Router, private sanphamService: SanphamService, private hoadonbanService: HoadonbanhangService,
    private khuyenmaiService: KhuyenmaiService, private thongtincuahangService: ThongtincuahangService) { }

  ngOnInit(): void {
    this.href = this.router.url;
    this.sanpham_id = this.href.replace('/detail/', '');
    this.getdssanpham();
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
          // Đếm sao vàng
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

  getthongtincuahang() {
    this.thongtincuahangService.getBanner().subscribe((res: any) => {
      this.thongtincuahang = res.cuahangs;
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

  HinhAnhTruoc(){
    if (this.arr_index > 0 ){
      this.arr_index -= 1;
      this.url = this.arrHinhAnh[this.index][this.arr_index].url;
    }
  }

  HinhAnhSau(){
    // console.log(this.arrHinhAnh[this.index].length - 1, this.arr_index)
    if (this.arrHinhAnh[this.index].length - 1 > this.arr_index){
      this.arr_index += 1;
      this.url = this.arrHinhAnh[this.index][this.arr_index].url;

    }

  }
}
