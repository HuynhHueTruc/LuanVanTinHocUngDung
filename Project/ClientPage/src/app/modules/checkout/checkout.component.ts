import { PhieudatService } from './../../../services/PhieuDat/phieudat.service';
import { PhieuDatModel } from './../../../models/PhieuDat/phieudat';
import { PhuongthucthanhtoanService } from './../../../services/PhuongThucThanhToan/phuongthucthanhtoan.service';
import { PhuongThucThanhToanModel } from './../../../models/PhuongThucThanhToan/phuongthucthanhtoan';
import { HinhThucVanChuyenModel } from './../../../models/HinhThucVanChuyen/hinhthucvanchuyen';
import { HinhthucvanchuyenService } from './../../../services/HinhThucVanChuyen/hinhthucvanchuyen.service';
import { Router } from '@angular/router';
import { GioHangModel } from './../../../models/GioHang/giohang';
import { KhuyenmaiService } from 'src/services/KhuyenMai/khuyenmai.service';
import { KhuyenMaiModel } from './../../../models/KhuyenMai/khuyenmai';
import { GiohangService } from './../../../services/GioHang/giohang.service';
import { Subscription, Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  arrSanPhamThanhToan: any;
  arrSanPham: any
  tong_tien = 0
  arrKhuyenMai: KhuyenMaiModel[] = [];
  giatrikhuyenmai = 0
  dskhuyenmai: KhuyenMaiModel[] = [];
  dsvanchuyen: HinhThucVanChuyenModel[] = [];
  dsthanhtoan: PhuongThucThanhToanModel[] = [];
  khuyenmai: KhuyenMaiModel;
  phieudat: PhieuDatModel;
  giohang: GioHangModel[] = [];
  sanphamthanhtoan = []
  datalogin: any;
  vanchuyen = [];
  thanhtoan = [];
  giavanchuyen = 0;
  dropdownSettings: IDropdownSettings;
  dropdownSettingsThanhToan: IDropdownSettings;
  private valueFromChildSubscription: Subscription;

  constructor(private giohangService: GiohangService, private khuyenmaiService: KhuyenmaiService, private router: Router, private hinhthucvanchuyenService: HinhthucvanchuyenService,
    private phuongthucthanhtoanService: PhuongthucthanhtoanService, private phieudatService: PhieudatService) { }

  ngOnInit(): void {


    this.getdshinhthucvanchuyen();
    this.getdsphuongthucthanhtoan();

    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.arrSanPhamThanhToan = this.giohangService.getArrSP();
    this.getdskhuyenmai();
    this.getgiohang();

    this.dropdownSettings = {
      singleSelection: true,
      idField: '_id',
      textField: 'Ten_hinh_thuc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

    this.dropdownSettingsThanhToan = {
      singleSelection: true,
      idField: '_id',
      textField: 'Ten_phuong_thuc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  // Lấy danh sách khuyến mãi
  getdskhuyenmai() {
    this.dskhuyenmai = []
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;

    });
  }

  getgiohang() {
    this.giohang = []

    this.giohangService.getGioHang(this.datalogin).subscribe(dt => {
      this.giohang = dt;
      for (const i in this.arrSanPhamThanhToan) {
        for (const j in this.giohang[0].San_Pham) {
          if (this.arrSanPhamThanhToan[i]._id === this.giohang[0].San_Pham[j].SanPham_id) {
            this.sanphamthanhtoan.push(this.giohang[0].San_Pham[j])
            this.arrSanPhamThanhToan[i].So_luong = this.giohang[0].San_Pham[j].So_luong
          }
        }
      }
      this.TongTien()
    });
  }


  getdshinhthucvanchuyen() {
    this.hinhthucvanchuyenService.getListHinhThucVanChuyen().subscribe((res: any) => {
      this.dsvanchuyen = res.hinhthucvanchuyens;
      this.vanchuyen.push(this.dsvanchuyen[0])
      this.giavanchuyen = this.dsvanchuyen[0].Gia

    });
  }

  // Hàm lấy danh sách
  getdsphuongthucthanhtoan() {
    this.phuongthucthanhtoanService.getListPhuongThucThanhToan().subscribe((res: any) => {
      this.dsthanhtoan = res.phuongthucthanhtoans;
      this.thanhtoan.push(this.dsthanhtoan[0])
    });
  }

  // Điều khiển vận chuyển
  onItemSelect(item: any) {
    document.getElementById('errVanChuyen').style.display = 'none'
    for (const i in this.dsvanchuyen) {
      if (this.dsvanchuyen[i]._id === this.vanchuyen[0]._id) {
        this.giavanchuyen = this.dsvanchuyen[i].Gia
      }
    }
  }


  onItemDeSelect(item: any) {
    document.getElementById('errVanChuyen').style.display = 'block'

  }

  // Điều khiển thanh toán
  onItemSelectThanhToan(item: any) {
    document.getElementById('errThanhToan').style.display = 'none'
  }

  onItemDeSelectThanhToan(item: any) {
    document.getElementById('errThanhToan').style.display = 'block'

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
    return bool;
  }


  TongTien() {
    // console.log(this.sanphamthanhtoan)
    // console.log(this.arrSanPhamThanhToan)
    this.tong_tien = 0;
    this.arrSanPham = []
    for (const i in this.arrSanPhamThanhToan) {
      this.KiemTraKhuyeMai(this.arrSanPhamThanhToan[i])
      // console.log(this.giatrikhuyenmai)
      this.tong_tien = this.tong_tien + (this.arrSanPhamThanhToan[i].Gia - this.arrSanPhamThanhToan[i].Gia * this.giatrikhuyenmai) * this.sanphamthanhtoan[i].So_luong
    }
  }

  ThayDoiThongTin() {
    this.router.navigateByUrl('/customerinfo')
  }

  DoiVanChuyen() {
    document.getElementById('changevanchuyen1').style.display = 'none'
    document.getElementById('changevanchuyen').style.display = 'block'
    document.getElementById('doivanchuyen').style.display = 'none'
    document.getElementById('luuvanchuyen').style.display = 'block'
  }

  DoiThanhToan() {
    document.getElementById('changethanhtoan1').style.display = 'none'
    document.getElementById('changethanhtoan').style.display = 'block'
    document.getElementById('doithanhtoan').style.display = 'none'
    document.getElementById('luuthanhtoan').style.display = 'block'

  }

  LuuVanChuyen() {
    document.getElementById('changevanchuyen1').style.display = 'block'
    document.getElementById('changevanchuyen').style.display = 'none'
    document.getElementById('doivanchuyen').style.display = 'block'
    document.getElementById('luuvanchuyen').style.display = 'none'
  }

  LuuThanhToan() {
    document.getElementById('changethanhtoan1').style.display = 'block'
    document.getElementById('changethanhtoan').style.display = 'none'
    document.getElementById('doithanhtoan').style.display = 'block'
    document.getElementById('luuthanhtoan').style.display = 'none'
  }

  DatHang() {
    this.phieudat = new PhieuDatModel();
    this.phieudat.San_Pham = [{SanPham_id: '', So_luong: 0, Gia_ban: 0}]
    this.phieudat.KhachHang_id = this.datalogin.Khach_hang_id
    this.phieudat.Ho_ten = this.datalogin.Ho_ten
    this.phieudat.Dia_chi = this.datalogin.Dia_chi
    this.phieudat.So_dien_thoai = this.datalogin.So_dien_thoai
    this.phieudat.ThanhToan_id = this.thanhtoan[0]._id
    this.phieudat.VanChuyen_id = this.vanchuyen[0]._id
    this.phieudat.Trang_thai = 'Chưa duyệt'
    this.phieudat.Tong_tien = this.tong_tien + this.giavanchuyen
    for (const i in this.arrSanPhamThanhToan) {
      this.phieudat.San_Pham.push({ SanPham_id: this.arrSanPhamThanhToan[i]._id, So_luong: this.arrSanPhamThanhToan[i].So_luong, Gia_ban: this.arrSanPhamThanhToan[i].Gia })
    }
    this.phieudat.San_Pham.splice(0,1);

    for (const j in this.giohang[0].San_Pham){
      for (const k in this.arrSanPhamThanhToan){
        if (this.giohang[0].San_Pham[j].SanPham_id === this.arrSanPhamThanhToan[k]._id){
          this.giohang[0].San_Pham.splice(Number.parseInt(j), 1);
        }
      }
    }
 this.phieudatService.ThemPhieuDat(this.phieudat).subscribe(dt => {
      alert('Đặt hàng thành công!')
      this.arrSanPhamThanhToan = []
      this.giohangService.CapNhatGioHang(this.giohang[0]).subscribe()
      this.giohangService.data = null
      this.router.navigateByUrl('/cart')

    })
    // console.log(this.giohang[0].San_Pham)
    // console.log(this.arrSanPhamThanhToan)
  }


}
