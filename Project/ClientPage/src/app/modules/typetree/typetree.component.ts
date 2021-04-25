import { KhuyenMaiModel } from './../../../models/KhuyenMai/khuyenmai';
import { KhuyenmaiService } from './../../../services/KhuyenMai/khuyenmai.service';
import { DanhMucNhoModel } from './../../../models/DanhMuc/DanhMucNho';
import { DanhMucModel } from './../../../models/DanhMuc/danhmuc';
import { DanhmucService } from './../../../services/DanhMuc/danhmuc.service';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { LoaiCayModel } from './../../../models/LoaiCay/loaicay';
import { LoaicayService } from './../../../services/LoaiCay/loaicay.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-typetree',
  templateUrl: './typetree.component.html',
  styleUrls: ['./typetree.component.scss']
})
export class TypetreeComponent implements  AfterViewInit  {

  dsloaicay: LoaiCayModel;
  loaicay: LoaiCayModel;
  href = '';
  loaicay_id;
  dssanpham: SanPhamModel;
  dsdanhmuc: DanhMucModel;
  dsdmcaycanh: any;
  dsdmhatgiong: any;
  dsdmchaucay: any;
  dsdmphanbon: any;
  dsdmdichvu: any;
  dsdmdungcu: any;
  dsloaicaycanh: DanhMucNhoModel[] = [];
  dscaycanh: SanPhamModel[] = [];
  dskhuyenmai: KhuyenMaiModel[] = [];
  giatrikhuyenmai = 0;
  arrKhuyenMai: KhuyenMaiModel[] = [];
  khuyenmai: KhuyenMaiModel;

  constructor(private router: Router, private loaicayService: LoaicayService, private route: ActivatedRoute,
              private sanphamService: SanphamService, private danhmucService: DanhmucService,
              private khuyenmaiService: KhuyenmaiService) { }

  // ngOnInit(): void {

  // }

  ngAfterViewInit(): void{
    this.href = this.router.url;
    this.loaicay_id = this.href.replace('/default/typetree/', '');
    this.getLoaiCay();
  }

  getLoaiCay() {
    this.loaicayService.getListLoaiCay().subscribe((res: any) => {
      this.dsloaicay = res.loaicays;

      for (const i in this.dsloaicay) {
        if (this.dsloaicay[i]._id === this.loaicay_id) {
          this.loaicay = this.dsloaicay[i];
        }
      }
      this.getdsdanhmuc();
    });
  }

  getdsdanhmuc() {
    this.danhmucService.getListDanhMuc().subscribe((res: any) => {
      this.dsdanhmuc = res.danhmucs;
      this.dsdmcaycanh = this.dsdanhmuc[1].Danh_muc_nho;
      this.dsdmhatgiong = this.dsdanhmuc[2].Danh_muc_nho;
      this.dsdmchaucay = this.dsdanhmuc[3].Danh_muc_nho;
      this.dsdmphanbon = this.dsdanhmuc[4].Danh_muc_nho;
      this.dsdmdichvu = this.dsdanhmuc[5].Danh_muc_nho;
      this.dsdmdungcu = this.dsdanhmuc[7].Danh_muc_nho;

      this.SoKhopLoaiCay(this.loaicay_id);
    });
  }

  getsanpham() {
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;

      for (const i in this.dssanpham) {
        if (this.dssanpham.hasOwnProperty(i)) {
          for (const j in this.dsloaicaycanh) {
            if (this.dsloaicaycanh.hasOwnProperty(j)) {
              if (this.dssanpham[i].Danh_Muc[0].DMN_id === this.dsloaicaycanh[j].DMN_id) {
                this.dscaycanh.push(this.dssanpham[i])
              }
            }
          }
        }
      }
      this.getdskhuyenmai();
      // console.log(this.dscaycanh)
    });
  }

  // Lấy danh sách khuyến mãi
  getdskhuyenmai() {
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;
      // console.log(this.dskhuyenmai)

    });
  }

// Lấy sản phẩm theo id được chọn
  SoKhopLoaiCay(loaicay_id) {
    // console.log(loaicay_id)
    // console.log(this.dsdmcaycanh);
    for (const i in this.dsdmcaycanh) {
      if (this.dsdmcaycanh[i].Loai_cay === loaicay_id) {
        this.dsloaicaycanh.push(this.dsdmcaycanh[i]);
      }
    }
    this.getsanpham();
    // console.log(this.dsloaicaycanh)
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
                // this.giatrikhuyenmai = this.dskhuyenmai[i].Gia_tri;
                // bool = true;
                // return bool;
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
}
