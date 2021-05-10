import { DanhmucService } from './../../../services/DanhMuc/danhmuc.service';
import { DanhMucModel } from './../../../models/DanhMuc/danhmuc';
import { LoaiCayModel } from './../../../models/LoaiCay/loaicay';
import { LoaicayService } from './../../../services/LoaiCay/loaicay.service';
import { Router } from '@angular/router';
import { HoaDonBanHangModel } from './../../../models/HoaDonBanHang/hoadonbanhang';
import { HoadonbanhangService } from './../../../services/HoaDonBanHang/hoadonbanhang.service';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { KhuyenmaiService } from './../../../services/KhuyenMai/khuyenmai.service';
import { KhuyenMaiModel } from './../../../models/KhuyenMai/khuyenmai';
import { Component, OnInit, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, AfterContentChecked {

  dskhuyenmai: KhuyenMaiModel
  dssanpham: SanPhamModel
  dshoadonbanhang: HoaDonBanHangModel

  arrdanhmuckhuyenmai = []
  danhmuckhuyenmais = []
  danhmucloaicay: DanhMucModel
  danhmuctmp = []
  loaicays: LoaiCayModel
  arrKhuyenMai: KhuyenMaiModel[] = [];
  giatrikhuyenmai = 0;
  khuyenmai: KhuyenMaiModel;
  isLoading = false;

  constructor(private khuyenmaiService: KhuyenmaiService, private sanphamService: SanphamService, private hoadonbanhangService: HoadonbanhangService, private router: Router,
    private loaicayService: LoaicayService, private danhmucService: DanhmucService) { }

  ngOnInit(): void {
    // this.getLoaiCay();
    // this.getdsdanhmuc();
    this.getdskhuyenmai()
    this.getdshoadonbanhang()
  }

  ngAfterContentChecked(): void {
    // Called after every check of the component's or directive's content.
    // Add 'implements AfterContentChecked' to the class.
    if (this.isLoading) {
      window.location.reload();
    }
    this.isLoading = false;
  }

  setHidden() {
    var hidden = document.getElementById('hidden');
    if (hidden.style.display === 'none') {
      var hidden2 = document.getElementById('hidden2');
      hidden2.style.display = 'none';
    } else {
      hidden.style.display = 'none';
    }
  }

  getdskhuyenmai() {
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais
      for (const i in this.dskhuyenmai) {
        if (new Date(this.dskhuyenmai[i].Ngay_bat_dau).getTime() < new Date().getTime()
          && new Date(this.dskhuyenmai[i].Ngay_ket_thuc).getTime() > new Date().getTime()) {
          this.arrdanhmuckhuyenmai = this.dskhuyenmai[i].Danh_muc_nho
        }
      }
      this.getdssanpham()

    })
  }

  // getdsdanhmuc() {
  //   this.danhmucService.getListDanhMuc().subscribe((res: any) => {
  //     this.danhmucloaicay = res.danhmucs[1];
  //     console.log(this.danhmucloaicay)
  //   })
  // }
  // // Lấy loại cây làm danh mục
  // getLoaiCay() {
  //   this.loaicayService.getListLoaiCay().subscribe((res: any) => {
  //     this.loaicays = res.loaicays;
  //   });
  // }


  getdshoadonbanhang() {
    this.hoadonbanhangService.getListHoaDonBan().subscribe((res: any) => {
      this.dshoadonbanhang = res.hoadonbanhangs;
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

  getdssanpham() {
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams

      for (const j in this.arrdanhmuckhuyenmai) {
        for (const i in this.dssanpham) {
          if (this.dssanpham[i].Danh_Muc[0].DMN_id === this.arrdanhmuckhuyenmai[j].DMN_id) {
            this.danhmuctmp.push(this.dssanpham[i])
          }
        }
        this.danhmuckhuyenmais.push(this.danhmuctmp[0])

        this.danhmuctmp = []
      }
    })
  }

  ProductDetail(eachDanhMuc){
    this.router.navigateByUrl(`/detail/${eachDanhMuc._id}`);
    this.isLoading = true;
  }

  // onSelectLTypeTree(eachDanhMuc) {
  //   let loaicay = '';
  //   // console.log(this.danhmucloaicay)
  //   // console.log(eachDanhMuc)
  //   for (const i in this.danhmucloaicay.Danh_muc_nho) {
  //     if (eachDanhMuc.Danh_Muc[0].DMN_id === this.danhmucloaicay.Danh_muc_nho[i].DMN_id) {
  //       loaicay = this.danhmucloaicay.Danh_muc_nho[i].Loai_cay
  //     }
  //   }
  //   this.router.navigateByUrl(`/default/typetree/${loaicay}`);
  //   this.isLoading = true;
  // }

  // onSelectProduct(eachSP?) {
  //   if (eachSP !== undefined) {
  //     this.router.navigateByUrl(`/default/product/${eachSP.DMN_id}`);
  //     this.isLoading = true;
  //   } else {
  //     this.router.navigate(['/default/product', '5f7d88277cc2cc2a04b1573d']);

  //   }
  // }

  KT(a) {
    console.log(a)
  }

}
