import { SanPhamModel } from './../../../models/SanPham/sanpham';
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
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SanphamService } from 'src/services/SanPham/sanpham.service';

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
  isgiohang = false
  arrgiatrikhuyenmai = []
  dropdownSettings: IDropdownSettings;
  dropdownSettingsThanhToan: IDropdownSettings;
  private valueFromChildSubscription: Subscription;
  public payPalConfig?: IPayPalConfig;
  showSuccess = false
  showCancel
  showError
  info = false
  dssanpham: SanPhamModel[] = []
  items = [] // Thông tin thanh toán Paypal
  value = 0
  constructor(private giohangService: GiohangService, private khuyenmaiService: KhuyenmaiService, private router: Router, private hinhthucvanchuyenService: HinhthucvanchuyenService,
    private phuongthucthanhtoanService: PhuongthucthanhtoanService, private phieudatService: PhieudatService, private modalService: NgbModal, private sanphamService: SanphamService) { }

  ngOnInit(): void {
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    this.arrSanPhamThanhToan = this.giohangService.getArrSP();
    if (this.arrSanPhamThanhToan === null) {
      alert('Lỗi: Bạn chưa chọn sản phẳm để thanh toán!')
      this.router.navigateByUrl('/default');
    } else {
      this.getdshinhthucvanchuyen();
      this.getdsphuongthucthanhtoan();
      this.getdskhuyenmai();
      this.getgiohang()
      this.getdssanpham()
      this.TongTien()

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

    this.initConfig();
  }

  getdssanpham(){
    this.sanphamService.getListSanPham().subscribe((res: any) =>{
      this.dssanpham = res.sanphams
    })
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
      if (this.giohang[0].San_Pham[0] === undefined) {
        this.isgiohang = false
      } else {
        for (const i in this.arrSanPhamThanhToan) {
          for (const j in this.giohang[0].San_Pham) {
            if (this.arrSanPhamThanhToan[i]._id === this.giohang[0].San_Pham[j].SanPham_id) {
              this.isgiohang = true
            }
          }
        }
      }
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
      for (const i in this.dsthanhtoan) {
        if (this.dsthanhtoan[i].Ten_phuong_thuc === 'Thanh toán trực tiếp') {
          this.thanhtoan[0] = this.dsthanhtoan[i]
        }
      }
    });
  }

  // Điều khiển vận chuyển
  onItemSelect(item: any) {
    for (const i in this.dsvanchuyen) {
      if (this.dsvanchuyen[i]._id === this.vanchuyen[0]._id) {
        this.giavanchuyen = this.dsvanchuyen[i].Gia
      }
    }
  }

  onItemDeSelect(item: any) {
    this.giavanchuyen = 0
  }

  // Điều khiển thanh toán
  onItemSelectThanhToan(item: any, content_paypal?) {
    this.items.splice(0, this.items.length)
    if (this.thanhtoan[0]._id === '5f7d89b47cc2cc2a04b15745') {
      // this.phieudat.Trang_thai = 'Đã duyệt'
      this.KTThanhToanOnline()
      if (this.info) {
        this.ThongTinPhieuDat()
        for (const sp in this.phieudat.San_Pham) {
          for (const j in this.dssanpham){
            if(this.phieudat.San_Pham[sp].SanPham_id === this.dssanpham[j]._id){
              this.items.push({name: this.dssanpham[j].Ten_san_pham, quantity: this.phieudat.San_Pham[sp].So_luong, unit_amount: { currency_code: 'USD',
              value: (this.phieudat.San_Pham[sp].Gia_ban/22946).toFixed(1)}})
            }
          }
        }
        console.log(this.items)
        for (const i in this.items){
          this.value += this.items[i].quantity*this.items[i].unit_amount.value
        }
        this.value.toFixed(1)
        this.modalService.open(content_paypal, { ariaLabelledBy: 'modal-paypal-title', backdrop: 'static', keyboard: false, size: 'lg' });
      }
    }
  }

  // Chọn khuyến mãi cao nhất của từng sản phẩm
  KiemTraKhuyenMai(eachSP) {
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
    // console.log(eachSP)
    return bool;
  }

  // Chọn khuyến mãi cao nhất của từng sản phẩm
  KiemTraSPKhuyenMai(eachSP, index) {
    this.dskhuyenmai = []
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;
      this.arrKhuyenMai = [];
      this.giatrikhuyenmai = 0;

      for (const i in this.dskhuyenmai) {
        if (this.dskhuyenmai.hasOwnProperty(i)) {
          for (const j in this.dskhuyenmai[i].Danh_muc_nho) {
            if (this.dskhuyenmai[i].Danh_muc_nho.hasOwnProperty(j)) {
              if (this.dskhuyenmai[i].Danh_muc_nho[j].DMN_id === eachSP.Danh_Muc[0].DMN_id) {
                if (new Date(this.dskhuyenmai[i].Ngay_bat_dau).getTime() < new Date().getTime()
                  && new Date(this.dskhuyenmai[i].Ngay_ket_thuc).getTime() > new Date().getTime()) {
                  this.arrKhuyenMai.push(this.dskhuyenmai[i]);
                }
              }
            }
          }
        }
      }
      for (const i in this.arrKhuyenMai) {
        if (this.arrKhuyenMai.hasOwnProperty(i)) {
          if (this.giatrikhuyenmai < this.arrKhuyenMai[i].Gia_tri) {
            this.giatrikhuyenmai = this.arrKhuyenMai[i].Gia_tri;
            this.arrgiatrikhuyenmai[index] = this.giatrikhuyenmai
            this.khuyenmai = this.arrKhuyenMai[i];
          }
        }
      }
      // Tính tiền
      this.tong_tien = this.tong_tien + (this.arrSanPhamThanhToan[index].Gia - this.arrSanPhamThanhToan[index].Gia * this.giatrikhuyenmai) * this.arrSanPhamThanhToan[index].So_luong
    });

  }

  TongTien() {
    this.tong_tien = 0;
    this.arrSanPham = []
    this.arrgiatrikhuyenmai = []
    for (const i in this.arrSanPhamThanhToan) {
      this.arrgiatrikhuyenmai.push(0)
      this.KiemTraSPKhuyenMai(this.arrSanPhamThanhToan[i], i)
    }

  }

  ThayDoiThongTin() {
    this.router.navigateByUrl('/customerinfo')
  }

  DoiVanChuyen() {
    this.vanchuyen = []
    document.getElementById('changevanchuyen1').style.display = 'none'
    document.getElementById('changevanchuyen').style.display = 'block'
  }

  DoiThanhToan() {
    this.thanhtoan = []
    document.getElementById('changethanhtoan1').style.display = 'none'
    document.getElementById('changethanhtoan').style.display = 'block'
  }

  LuuVanChuyen() {
    document.getElementById('changevanchuyen1').style.display = 'block'
    document.getElementById('changevanchuyen').style.display = 'none'
    document.getElementById('doivanchuyen').style.display = 'block'
  }

  LuuThanhToan() {
    document.getElementById('changethanhtoan1').style.display = 'block'
    document.getElementById('changethanhtoan').style.display = 'none'
  }

  KTNull() {
    if (this.thanhtoan[0] !== undefined && this.vanchuyen[0] !== undefined) {
      this.phieudat.ThanhToan_id = this.thanhtoan[0]._id
      this.LuuThanhToan()
      this.phieudat.VanChuyen_id = this.vanchuyen[0]._id
      this.LuuVanChuyen()
      this.info = true
    }
    else {
      alert('Vui lòng chọn đầy đủ thông tin')
    }

  }

  KTThanhToanOnline() {
    if (this.vanchuyen[0] === undefined) {
      alert('Vui lòng chọn hình thức vận chuyển')
      this.info = false

      for (const i in this.dsthanhtoan) {
        if (this.dsthanhtoan[i].Ten_phuong_thuc === 'Thanh toán trực tiếp') {
          this.thanhtoan[0] = this.dsthanhtoan[i]
        }
      }
      document.getElementById('changethanhtoan').style.display = 'none'
      document.getElementById('changethanhtoan1').style.display = 'block'
    } else {
      this.info = true
    }
  }

  ThongTinPhieuDat() {
    this.phieudat = new PhieuDatModel();
    this.phieudat.San_Pham = [{ SanPham_id: '', So_luong: 0, Gia_ban: 0 }]
    this.phieudat.KhachHang_id = this.datalogin.Khach_hang_id
    this.phieudat.Ho_ten = this.datalogin.Ho_ten
    this.phieudat.Dia_chi = this.datalogin.Dia_chi
    this.phieudat.So_dien_thoai = this.datalogin.So_dien_thoai
    this.phieudat.Tong_tien = this.tong_tien + this.giavanchuyen
    for (const i in this.arrSanPhamThanhToan) {
      this.phieudat.San_Pham.push({ SanPham_id: this.arrSanPhamThanhToan[i]._id, So_luong: this.arrSanPhamThanhToan[i].So_luong, Gia_ban: this.arrSanPhamThanhToan[i].Gia })
    }
    this.phieudat.San_Pham.splice(0, 1);
  }

  DatHang(content_paypal?) {
    this.ThongTinPhieuDat()
    this.KTNull()
    if (this.info) {
      if (this.showSuccess) {
        this.phieudat.Trang_thai = 'Đã duyệt'

      } else {
        this.phieudat.Trang_thai = 'Chưa duyệt'
      }
      if (this.isgiohang) {
        for (const j in this.giohang[0].San_Pham) {
          for (const k in this.arrSanPhamThanhToan) {
            if (this.giohang[0].San_Pham[j].SanPham_id === this.arrSanPhamThanhToan[k]._id) {
              this.giohang[0].San_Pham.splice(Number.parseInt(j), 1);
            }
          }
        }
      }

      this.phieudatService.ThemPhieuDat(this.phieudat).subscribe(dt => {
        this.phieudatService.GuiEmailPhieuDat(this.phieudat, this.arrgiatrikhuyenmai).subscribe()
        alert('Đặt hàng thành công!')
        this.modalService.dismissAll()
        this.arrSanPhamThanhToan = []
        this.giohangService.CapNhatGioHang(this.giohang[0]).subscribe()
        this.giohangService.data = null
        this.router.navigateByUrl('/bill_manegement')
      })
    }
  }

  HuyThanhToanOnline() {
    for (const i in this.dsthanhtoan) {
      if (this.dsthanhtoan[i].Ten_phuong_thuc === 'Thanh toán trực tiếp') {
        this.thanhtoan[0] = this.dsthanhtoan[i]
      }
    }
    document.getElementById('changethanhtoan').style.display = 'none'
    document.getElementById('changethanhtoan1').style.display = 'block'
    this.modalService.dismissAll()
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AX46LoTcAt--Q6lLrIYagu2CFyN1KrC9cm7qk-v5O3sf6VlKc5s8MzAsG_CvNvFQxzmZNMiAUcOHXrpt',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: this.value.toString(), // Tổng số sản phẩm * giá tiền
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: this.value.toString() //Tổng số sản phẩm * giá tiền
              }
            }
          },
          items: this.items
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          this.DatHang()
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        // this.resetStatus();
      },
    };
  }

}
