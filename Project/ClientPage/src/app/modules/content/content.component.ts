import { DanhMucNhoModel } from './../../../models/DanhMuc/DanhMucNho';
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
  dssanphambanchay = []
  dssanpham: SanPhamModel[] = []
  sanphams: SanPhamModel[] = []
  dshoadonbanhang: HoaDonBanHangModel
  dsloaicay: LoaiCayModel[] = []
  dssanphamtheoloai: SanPhamModel[] = []
  arrdanhmuckhuyenmai = []
  arrsanphambanchay = []
  arrsanphamtrangchu: SanPhamModel[] = []
  danhmuckhuyenmais = []
  sanphambanchays = []
  danhmucloaicay: DanhMucModel
  danhmuctmp = []
  loaicays: LoaiCayModel[] = []
  arrKhuyenMai: KhuyenMaiModel[] = [];
  giatrikhuyenmai = 0;
  khuyenmai: KhuyenMaiModel;
  isLoading = false;
  p: number = 1;
  dsdanhmuc: DanhMucModel;
  dsdmcaycanh: any;
  dsloaicaycanh: DanhMucNhoModel[] = [];
  danhmucdaidien: DanhMucNhoModel[] = []
  dscaycanh: SanPhamModel[] = [];
  arrSoLuongBan = 0;


  constructor(private khuyenmaiService: KhuyenmaiService, private sanphamService: SanphamService, private hoadonbanhangService: HoadonbanhangService, private router: Router,
    private loaicayService: LoaicayService, private danhmucService: DanhmucService) { }

  ngOnInit(): void {

    this.getLoaiCay();
    this.getdskhuyenmai()
  }

  ngAfterContentChecked(): void {
    // Called after every check of the component's or directive's content.
    // Add 'implements AfterContentChecked' to the class.
    if (this.isLoading) {
      window.location.reload();
    }
    this.isLoading = false;
  }

  getdsdanhmuc(arrloaicay) {
    this.danhmucService.getListDanhMuc().subscribe((res: any) => {
      this.dsdanhmuc = res.danhmucs;
      this.dsdmcaycanh = this.dsdanhmuc[1].Danh_muc_nho;
      this.SoKhopLoaiCay(arrloaicay);
    });
  }

  // Lấy sản phẩm theo id được chọn
  SoKhopLoaiCay(arrloaicay) {
    let arrtmp: any;
    this.danhmucdaidien = []
    for (const j in arrloaicay) {
      for (const i in this.dsdmcaycanh) {
        if (this.dsdmcaycanh[i].Loai_cay === arrloaicay[j]._id) {
          this.dsloaicaycanh.push(this.dsdmcaycanh[i]);
        }
      }
      arrtmp = this.dsloaicaycanh
      this.danhmucdaidien.push(arrtmp)
      this.dsloaicaycanh = [];
    }
    this.getdssanphamtrangchu();
  }

  getdssanphamtrangchu() {
    let arrtmp: any
    let lsttmp: SanPhamModel[] = []
    let random = []
    let arrrandom: any
    this.arrsanphamtrangchu = []
    this.dssanphamtheoloai = []
    let sl = []
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams;

      for (const j in this.danhmucdaidien) {
        for (const k in this.danhmucdaidien[j]) {
          if (this.danhmucdaidien[j].hasOwnProperty(k)) {
            for (const i in this.dssanpham) {
              if (this.dssanpham.hasOwnProperty(i)) {
                if (this.dssanpham[i].Danh_Muc[0].DMN_id === this.danhmucdaidien[j][k].DMN_id) {
                  lsttmp.push(this.dssanpham[i]);
                }
              }
            }
          }
        }
        arrtmp = lsttmp
        this.dssanphamtheoloai.push(arrtmp)
        lsttmp = [];
      }
      for (const l in this.dssanphamtheoloai) {
        if (this.dssanphamtheoloai.hasOwnProperty(l)) {
          for (let i = 0; i < 4; i++) {
            random.push(this.dssanphamtheoloai[l][Math.floor(Math.random() * this.dssanphambanchay.length)])
          }
          arrrandom = random
          this.arrsanphamtrangchu.push(arrrandom);
          random = []
        }
      }
      // for (const i in this.arrsanphamtrangchu) {
      //   for (const j in this.arrsanphamtrangchu[i]) {
      //     for (const i in this.dssanphambanchay) {
      //       if (this.dssanphambanchay[i].SanPham_id === this.arrsanphamtrangchu[i][j]._id) {
      //         sl.push(this.dssanphambanchay[i].So_luong)
      //       }
      //     }
      //   }
      //   this.arrSoLuongBan.push(sl)
      //   sl = []
      // }
      // console.log(this.arrSoLuongBan)
    });
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
          for (const j in this.dskhuyenmai[i].Danh_muc_nho) {
            this.arrdanhmuckhuyenmai.push(this.dskhuyenmai[i].Danh_muc_nho[j].DMN_id)
          }
        }
      }
      // Xóa trùng sản phẩm trong arrdanhmuckhuyenmai
      this.arrdanhmuckhuyenmai = [...new Set(this.arrdanhmuckhuyenmai)];
      this.getdshoadonbanhang();

    })
  }

  // Hàm sắp xếp giảm dần mãng json
  sortJSON(data, key, way) {
    return data.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      if (way === '123') { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
      if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
    });
  }

  getdshoadonbanhang() {
    let count = 0
    let arrXoaTrung = []
    let sanpham = ''
    this.hoadonbanhangService.getListHoaDonBan().subscribe((res: any) => {
      this.dshoadonbanhang = res.hoadonbanhangs;
      for (const i in this.dshoadonbanhang) {
        for (const j in this.dshoadonbanhang[i].San_Pham) {
          this.arrsanphambanchay.push(this.dshoadonbanhang[i].San_Pham[j])
          arrXoaTrung.push(this.dshoadonbanhang[i].San_Pham[j].SanPham_id)
        }
      }
      arrXoaTrung = [...new Set(arrXoaTrung)]

      // Tính số lượng bán được của từng sản phẩm
      for (const h in arrXoaTrung) {
        for (const k in this.arrsanphambanchay) {
          if (this.arrsanphambanchay[k].SanPham_id === arrXoaTrung[h]) {
            sanpham = this.arrsanphambanchay[k].SanPham_id
            count += this.arrsanphambanchay[k].So_luong
          }
        }
        this.dssanphambanchay.push({ SanPham_id: sanpham, So_luong: count })
        sanpham = ''
        count = 0
      }

      // Sắp xếp mảng giảm dần
      this.dssanphambanchay = this.sortJSON(this.dssanphambanchay, 'So_luong', '321'); // 123: tăng dần or 321: giảm dần
      this.getdssanpham()
    })
  }

  // Chọn khuyến mãi cao nhất của từng sản phẩm
  KiemTraKhuyeMai(eachSP) {
    this.arrKhuyenMai = [];
    this.giatrikhuyenmai = 0;
    let bool = false;
    if (eachSP !== undefined) {

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
    } else {
      bool = false
    }

    // console.log(this.khuyenmai)
    return bool;
  }

  getdssanpham() {
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams
      // this.sanphams = res.sanphams
      for (const j in this.arrdanhmuckhuyenmai) {
        for (const i in this.dssanpham) {
          if (this.dssanpham[i].Danh_Muc[0].DMN_id === this.arrdanhmuckhuyenmai[j]) {
            this.danhmuctmp.push(this.dssanpham[i])
          }
        }
        this.danhmuckhuyenmais.push(this.danhmuctmp[0])
        this.danhmuctmp = []
      }

      for (const h in this.dssanphambanchay) {
        for (const k in this.dssanpham) {
          if (this.dssanpham[k]._id === this.dssanphambanchay[h].SanPham_id) {
            this.sanphambanchays.push(this.dssanpham[k])
          }
        }
      }
      // console.log(this.sanphambanchays)
    })
  }

  ProductDetail(eachDanhMuc) {
    this.router.navigateByUrl(`/detail/${eachDanhMuc._id}`);
    this.isLoading = true;
  }

  //  // Hàm tìm kiếm theo tên hoặc id
  //  SearchByKeyWord() {
  //   this.dskhuyenmai = this.dskhuyenmaisearch;
  //   const text = this.removeAccents(this.keyword);
  //   if (text === '') {
  //     this.getdskhuyenmai();
  //   } else {
  //     this.dskhuyenmai = this.dskhuyenmai.filter(res => {
  //       const hoten = this.removeAccents(res.Ten_khuyen_mai);
  //       const maso = this.removeAccents(res._id);
  //       const tmp2 = text.replace(/·/g, '');
  //       if (hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
  //         return hoten.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
  //       } else {
  //         if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
  //           return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
  //         }
  //       }
  //     });
  //   }
  // }

  // Lấy loại cây làm danh mục
  getLoaiCay() {
    let count = 0;
    this.loaicayService.getListLoaiCay().subscribe((res: any) => {
      this.dsloaicay = res.loaicays;
      this.ChuyenTrang(1);

    });
  }

    SoLuongBan(eachSP, i){

      if (eachSP !== undefined){
        for (const i in this.dssanphambanchay){
          if (this.dssanphambanchay[i].SanPham_id === eachSP._id){
            this.arrSoLuongBan = this.dssanphambanchay[i].So_luong
            return true
          }else{
            this.arrSoLuongBan = 0

          }
        }
      }
      return true

    }

  KiemTraChanLe(index) {
    return index % 2 === 0
  }


  DSSanPham(LoaiCay_id) {
    this.router.navigateByUrl(`/default/typetree/${LoaiCay_id}`);
    this.isLoading = true;
  }

  ChuyenTrang(number) {
    this.loaicays = []
    this.arrSoLuongBan = 0;
    for (let i = 0; i < 4; i++) {
      this.loaicays.push(this.dsloaicay[((number - 1) * 4) + i]);
    }
    this.getdsdanhmuc(this.loaicays);
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

  // getdsdanhmuc() {
  //   this.danhmucService.getListDanhMuc().subscribe((res: any) => {
  //     this.danhmucloaicay = res.danhmucs[1];
  //     console.log(this.danhmucloaicay)
  //   })
  // }


}
