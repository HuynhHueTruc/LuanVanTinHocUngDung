import { PhuongThucThanhToanModel } from './../../../models/PhuongThucThanhToan/phuongthucthanhtoan';
import { HinhThucVanChuyenModel } from './../../../models/HinhThucVanChuyen/hinhthucvanchuyen';
import { PhuongthucthanhtoanService } from './../../../services/PhuongThucThanhToan/phuongthucthanhtoan.service';
import { HinhthucvanchuyenService } from './../../../services/HinhThucVanChuyen/hinhthucvanchuyen.service';
import { DiaChiDKModle } from './../../../models/DiaChi/Diachi_DK';
import { SanPhamModel } from './../../../models/SanPham/sanpham';
import { SanphamService } from './../../../services/SanPham/sanpham.service';
import { HoadonbanhangService } from './../../../services/HoaDonBanHang/hoadonbanhang.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HoaDonBanHangModel } from './../../../models/HoaDonBanHang/hoadonbanhang';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billofsale',
  templateUrl: './billofsale.component.html',
  styleUrls: ['./billofsale.component.scss']
})
export class BillofsaleComponent implements OnInit {

  hoadon: HoaDonBanHangModel;
  thongtinsanpham = [];
  thongtinvanchuyen: HinhThucVanChuyenModel[] = [];
  thongtinthanhtoan: PhuongThucThanhToanModel[] = [];
  dssanpham: SanPhamModel;
  dshinhthucvanchuyen: HinhThucVanChuyenModel;
  dsphuongthucthanhtoan: PhuongThucThanhToanModel;

  arrSanPham: SanPhamModel[] = [];
  keyword: string;
  dshoadonban: HoaDonBanHangModel[] = [];
  dshoadonsearch: HoaDonBanHangModel[] = [];
  arrdiachi: DiaChiDKModle[] = [];
  dsdiachi: DiaChiDKModle[] = [];
  hienthi = false
  p: number = 1
  hoadons: HoaDonBanHangModel[] = []
  thongtinchitietsanpham = []
  hoadonchitiet = []
  constructor(private modalService: NgbModal, private hoadonbanService: HoadonbanhangService, private sanphamService: SanphamService, private hinhthucvanchuyenService: HinhthucvanchuyenService,
    private phuongthucthanhtoanService: PhuongthucthanhtoanService) { }

  ngOnInit(): void {
    this.hoadonbanService.getRefeshPage().subscribe(dt => {
      this.getdshoadonban();
    })
    this.getdshoadonban()
  }

  getdshoadonban() {
    this.hoadonbanService.getListHoaDonBanHang().subscribe((res: any) => {
      this.hoadon = res.hoadonbanhangs;
      this.dshoadonban = res.hoadonbanhangs;
      // h??? tr??? searchbykeywword v?? searchbysex
      this.dshoadonsearch = res.hoadonbanhangs;
      if (this.hoadons.length === 0) {
        this.p = 1
      }
      this.ChuyenTrang(this.p)
    })
  }

  getdsHinhThucVanChuyen(dshoadon) {
    this.hinhthucvanchuyenService.getListHinhThucVanChuyen().subscribe((res: any) => {
      this.dshinhthucvanchuyen = res.hinhthucvanchuyens
      this.compareVanChuyen_id(dshoadon)
    })
  }

  getdsPhuongThucThanhToan(dshoadon) {
    this.phuongthucthanhtoanService.getListPhuongThucThanhToan().subscribe((res: any) => {
      this.dsphuongthucthanhtoan = res.phuongthucthanhtoans;
      this.compareThanhToan_id(dshoadon)

    })
  }

  // H??m t??m ki???m theo t??n ho???c id
  SearchByKeyWord() {
    this.hoadons = this.dshoadonsearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdshoadonban();
    } else {
      this.hoadons = this.hoadons.filter(res => {
        // C???n xem l???i, n???u nh???p t??n nh??n vi??n th?? s??? g???i ??
        const nhanvien = this.removeAccents(res.NhanVien_id);
        const maso = this.removeAccents(res._id);
        const tmp2 = text.replace(/??/g, '');
        if (nhanvien.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
          return nhanvien.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
        } else {
          if (maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase())) {
            return maso.toLocaleLowerCase().match(tmp2.toLocaleLowerCase());
          }
        }
      });
    }
  }

  SearchByOption(value) {
    this.hoadons = this.dshoadonsearch;
    value.preventDefault();
    const target = value.target.value;
    if (target === 'C?? nh???t') {
      this.thongtinsanpham = []
      this.thongtinthanhtoan = []
      this.thongtinvanchuyen = []
      this.getdshoadonban();
    } else {
      if (target === 'M???i nh???t') {
        this.hoadons.reverse();
        this.thongtinsanpham.reverse()
        this.thongtinthanhtoan.reverse()
        this.thongtinvanchuyen.reverse()
      }
      this.ChuyenTrang(this.p)
    }
  }

  // H??m chuy???n ?????i ti???ng Vi???t sang ti???ng Anh
  removeAccents(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/??/g, 'd').replace(/??/g, 'D')
      ;
  }

  // L???y th??ng tin s???n ph???m
  getdsSanPham(dshoadon) {
    try {
      this.sanphamService.getListSanPham().subscribe((res: any) => {
        this.dssanpham = res.sanphams;
        this.compareSanPham_id(dshoadon)
      })
    } catch (error) {
      alert(error)
    }
  }

  // T??m ?????i t?????ng so kh???p
  compareSanPham_id(dshoadon) {
    this.arrSanPham = []
    this.thongtinsanpham.splice(0, this.thongtinsanpham.length)
    for (const dmn in dshoadon) {
      for (const dmn2 in dshoadon[dmn].San_Pham) {
        for (const sp in this.dssanpham) {
          if (dshoadon[dmn].San_Pham[dmn2].SanPham_id === this.dssanpham[sp]._id) {
            this.arrSanPham.push(this.dssanpham[sp])
          }
        }
      }
      this.thongtinsanpham.push(this.arrSanPham)

      this.arrSanPham = [];
    }
  }

  // T??m ?????i t?????ng so kh???p
  compareThanhToan_id(dshoadon) {
    this.thongtinthanhtoan = []
    for (const dmn in dshoadon) {
      for (const sp in this.dsphuongthucthanhtoan) {
        if (dshoadon[dmn].ThanhToan_id === this.dsphuongthucthanhtoan[sp]._id) {
          this.thongtinthanhtoan.push(this.dsphuongthucthanhtoan[sp])
        }
      }
    }
    // console.log(this.thongtinthanhtoan)
  }

  // T??m ?????i t?????ng so kh???p
  compareVanChuyen_id(dshoadon) {
    this.thongtinvanchuyen = []
    for (const dmn in dshoadon) {
      for (const sp in this.dshinhthucvanchuyen) {
        if (dshoadon[dmn].VanChuyen_id === this.dshinhthucvanchuyen[sp]._id) {
          this.thongtinvanchuyen.push(this.dshinhthucvanchuyen[sp])
        }
      }
    }

  }

  // H??m m??? Dialog T???o t??i kho???n
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    // G??n gi?? tr??? r???ng ban ?????u cho nhanvien, n???u kh??ng s??? b??o l???i kh??ng ?????c ???????c undefine
    this.hoadon = new HoaDonBanHangModel();
    this.hoadon.San_Pham = [{ SanPham_id: '', So_luong: 0, Gia_ban: 0 }]
  }



  HienThiMa() {
    this.hienthi = true
    document.getElementById('AnMa').style.display = 'block'
    document.getElementById('HienThiMa').style.display = 'none'
  }

  AnMa() {
    this.hienthi = false
    document.getElementById('AnMa').style.display = 'none'
    document.getElementById('HienThiMa').style.display = 'block'

  }

  ChuyenTrang(number) {
    this.hoadons = []
    this.dsdiachi = []
    this.arrdiachi = []
    for (let i = 0; i < 5; i++) {
      if ((this.hoadon[((number - 1) * 5) + i]) !== undefined) {
        this.hoadons.push(this.hoadon[((number - 1) * 5) + i]);
      }
    }


    this.getdsHinhThucVanChuyen(this.hoadons)
    this.getdsPhuongThucThanhToan(this.hoadons)
    this.getdsSanPham(this.hoadons)

    for (const dc in this.hoadons) {
      if (this.hoadons.hasOwnProperty(dc)) {
        this.dsdiachi.push(this.hoadons[dc].Dia_chi);
      }
    }

    for (const dc in this.dsdiachi) {
      if (this.dsdiachi.hasOwnProperty(dc)) {
        this.arrdiachi.push(this.dsdiachi[dc][0]);
      }
    }
  }

  DetailSanPham(index, content_product_detail, eachHoaDon) {
    this.thongtinchitietsanpham = this.thongtinsanpham[index]
    this.hoadonchitiet = eachHoaDon
    this.modalService.open(content_product_detail, { ariaLabelledBy: 'modal-product-detail-title', backdrop: 'static', keyboard: false, size: 'lg' });

  }
}