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
      // hỗ trợ searchbykeywword và searchbysex
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

  // Hàm tìm kiếm theo tên hoặc id
  SearchByKeyWord() {
    this.hoadons = this.dshoadonsearch;
    const text = this.removeAccents(this.keyword);
    if (text === '') {
      this.getdshoadonban();
    } else {
      this.hoadons = this.hoadons.filter(res => {
        // Cần xem lại, nếu nhập tên nhân viên thì sẽ gợi ý
        const nhanvien = this.removeAccents(res.NhanVien_id);
        const maso = this.removeAccents(res._id);
        const tmp2 = text.replace(/·/g, '');
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
    if (target === 'Cũ nhất') {
      this.thongtinsanpham = []
      this.thongtinthanhtoan = []
      this.thongtinvanchuyen = []
      this.getdshoadonban();
    } else {
      if (target === 'Mới nhất') {
        this.hoadons.reverse();
        this.thongtinsanpham.reverse()
        this.thongtinthanhtoan.reverse()
        this.thongtinvanchuyen.reverse()
      }
      this.ChuyenTrang(this.p)
    }
  }

  // Hàm chuyển đổi tiếng Việt sang tiếng Anh
  removeAccents(str) {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      ;
  }

  // Lấy thông tin sản phẩm
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

  // Tìm đối tượng so khớp
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

  // Tìm đối tượng so khớp
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

  // Tìm đối tượng so khớp
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

  // Hàm mở Dialog Tạo tài khoản
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static', keyboard: false });
    // Gán giá trị rỗng ban đầu cho nhanvien, nếu không sẽ báo lỗi không đọc được undefine
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
}
