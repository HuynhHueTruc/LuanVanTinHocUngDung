import { SanphamService } from './../../../../services/SanPham/sanpham.service';
import { HoadonbanhangService } from './../../../../services/HoaDonBanHang/hoadonbanhang.service';
import { KhuyenmaiService } from './../../../../services/KhuyenMai/khuyenmai.service';

import { SanPhamModel } from './../../../../models/SanPham/sanpham';
import { KhuyenMaiModel } from './../../../../models/KhuyenMai/khuyenmai';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { HoaDonBanHangModel } from './../../../../models/HoaDonBanHang/hoadonbanhang';
import { SanPhamBanDuocModal } from './../../../../models/ThongKe/sanphambanduoc';
import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
  sanphambanduoc: SanPhamBanDuocModal[] = []
  dshoadon: HoaDonBanHangModel
  dssanpham: SanPhamModel
  dssanphamchitiet: SanPhamModel
  arrSanPham: SanPhamModel[] = [];
  thongtinsanpham: SanPhamModel[] = []
  sanphams: SanPhamBanDuocModal[] = []
  sumAmount = 0
  arr_id_sanpham = []
  chartOptions: {};
  Highcharts = Highcharts;
  dataHighcharts = []

  Gia = 0
  tong_doanh_thu = 0
  quy: number = 1
  arrnam = []
  nam = new Date().getFullYear();
  canam = false
  arrgiatrikhuyenmai = []
  dskhuyenmai: KhuyenMaiModel[] = []
  arrsanpham = []
  tong_thu = 0
  constructor(private hoadonbanhangService: HoadonbanhangService, private sanphamService: SanphamService, private khuyenmaiService: KhuyenmaiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getdsHoaDonBanHang()

    // Tạo value cho select năm
    for (let i = 2019; i <= this.nam; i++) {
      this.arrnam.push(i)
    }
    this.chartOptions = {
      series: [{}]
    };
  }

  getdsHoaDonBanHang() {
    this.hoadonbanhangService.getListHoaDonBanHang().subscribe((res: any) => {
      this.dshoadon = res.hoadonbanhangs
      for (const i in this.dshoadon) {
        for (const j in this.dshoadon[i].San_Pham) {
          this.sanphams.push({ SanPham_id: this.dshoadon[i].San_Pham[j].SanPham_id, So_luong: this.dshoadon[i].San_Pham[j].So_luong, Gia_ban: this.dshoadon[i].San_Pham[j].Gia_ban, Thoi_gian_ban: this.dshoadon[i].Ngay_cap_nhat })
        }
      }
      for (const i in this.sanphams) {

        if (new Date(this.sanphams[i].Thoi_gian_ban).getFullYear() === this.nam) {
          if (!this.canam) {
            let month = new Date(this.sanphams[i].Thoi_gian_ban).getMonth() + 1
            if (this.XacDinhQuy(month) === this.quy) {
              this.sanphambanduoc.push(this.sanphams[i])
            }
          } else {
            this.sanphambanduoc.push(this.sanphams[i])
          }
        }
      }

      for (const count in this.sanphambanduoc) {
        this.sumAmount += this.sanphambanduoc[count].So_luong
      }

      this.getdsSanPham(this.sanphambanduoc)

    })
  }

  // Xác định quý của tháng
  XacDinhQuy(month) {
    switch (month) {
      case 1:
        return 1
      case 2:
        return 1
      case 3:
        return 1
      case 4:
        return 2
      case 5:
        return 2
      case 6:
        return 2
      case 7:
        return 3
      case 8:
        return 3
      case 9:
        return 3
      case 10:
        return 4
      case 11:
        return 4
      case 12:
        return 4
    }
  }


  getdsSanPham(sanphambanduoc) {
    this.sanphamService.getListSanPham().subscribe((res: any) => {
      this.dssanpham = res.sanphams
      this.compareSanPham_id(sanphambanduoc)
    })
  }

  // Tìm đối tượng so khớp
  async compareSanPham_id(sanphambanduoc) {
    this.arrSanPham = []
    this.arrgiatrikhuyenmai = []
    this.thongtinsanpham.splice(0, this.thongtinsanpham.length)
    for (const dmn in sanphambanduoc) {
      for (const sp in this.dssanpham) {
        if (sanphambanduoc[dmn].SanPham_id === this.dssanpham[sp]._id) {
          this.arrSanPham.push(this.dssanpham[sp])
          this.arrgiatrikhuyenmai.push(0)
          await this.KiemTraSPKhuyenMai(this.dssanpham[sp], dmn)
        }
      }
      this.thongtinsanpham.push(this.arrSanPham[0])
      this.arrSanPham = [];
    }
    this.XoaTrungSanPham()
    this.getdsKhuyenMai()
    this.DataHighChart()
  }

  XoaTrungSanPham() {
    const uniqueSet = new Set(this.thongtinsanpham);
    this.thongtinsanpham = [...uniqueSet];
  }

  getdsKhuyenMai() {
    this.khuyenmaiService.getListKhuyenMai().subscribe((res: any) => {
      this.dskhuyenmai = res.khuyenmais;
    });

  }

  // Chọn khuyến mãi cao nhất của từng sản phẩm
  KiemTraSPKhuyenMai(eachSP, index) {
    let arrKhuyenMai = [];
    let giatrikhuyenmai = 0;
    for (const i in this.dskhuyenmai) {
      if (this.dskhuyenmai.hasOwnProperty(i)) {
        for (const j in this.dskhuyenmai[i].Danh_muc_nho) {
          if (this.dskhuyenmai[i].Danh_muc_nho.hasOwnProperty(j)) {
            if (this.dskhuyenmai[i].Danh_muc_nho[j].DMN_id === eachSP.Danh_Muc[0].DMN_id) {
              if (new Date(this.dskhuyenmai[i].Ngay_bat_dau).getTime() < new Date().getTime()
                && new Date(this.dskhuyenmai[i].Ngay_ket_thuc).getTime() > new Date().getTime()) {
                arrKhuyenMai.push(this.dskhuyenmai[i]);
              }
            }
          }
        }
      }
    }

    for (const i in arrKhuyenMai) {
      if (arrKhuyenMai.hasOwnProperty(i)) {
        if (new Date(arrKhuyenMai[i].Ngay_bat_dau).getTime() > new Date(eachSP.Thoi_gian_ban).getTime()
          || new Date(arrKhuyenMai[i].Ngay_ket_thuc).getTime() < new Date(eachSP.Thoi_gian_ban).getTime()) {
          this.arrgiatrikhuyenmai[index] = 0 // Khuyến mãi của từng sản phẩm theo thời gian của đơn hàng
        } else {
          if (giatrikhuyenmai < arrKhuyenMai[i].Gia_tri) {
            giatrikhuyenmai = arrKhuyenMai[i].Gia_tri;
            this.arrgiatrikhuyenmai[index] = arrKhuyenMai[i].Gia_tri
          }
        }

      }
    }
    console.log(this.arrgiatrikhuyenmai)
  }

  DataHighChart() {

    let sum = 0;
    this.arrsanpham = []

    for (const i in this.thongtinsanpham) {
      for (const j in this.sanphambanduoc) {
        if (this.sanphambanduoc[j].SanPham_id === this.thongtinsanpham[i]._id) {
          sum += this.sanphambanduoc[j].So_luong
          this.arrsanpham.push({ Ten_san_pham: this.thongtinsanpham[i].Ten_san_pham, So_luong: this.sanphambanduoc[j].So_luong, Gia: this.thongtinsanpham[i].Gia, Khuyen_mai: this.arrgiatrikhuyenmai[j] })

        }
      }

      this.dataHighcharts.push({ name: this.thongtinsanpham[i].Ten_san_pham, y: (sum * 100) / this.sumAmount, _id: this.thongtinsanpham[i]._id, Gia: this.thongtinsanpham[i].Gia })
      sum = 0
    }
    // console.log(this.arrsanpham)
    // console.log(this.arrgiatrikhuyenmai)
    this.TongThu()
    this.RawHighcharts()
    this.DoanhThu()
  }

  TongThu() {

    this.tong_thu = 0
    for (const j in this.arrsanpham) {
      this.tong_thu += this.arrsanpham[j].So_luong * (this.arrsanpham[j].Gia - this.arrsanpham[j].Gia * this.arrsanpham[j].Khuyen_mai)
    }
    // console.log(this.tong_thu)
  }

  GiaBan(eachSanPham) {
    for (const i in this.dssanpham) {
      if (this.dssanpham[i]._id === eachSanPham._id) {
        this.Gia = this.dssanpham[i].Gia
      }
    }
    return true
  }

  DoanhThu() {
    for (const i in this.dataHighcharts) {
      this.tong_doanh_thu += ((this.dataHighcharts[i].y * this.sumAmount) / 100) * this.dataHighcharts[i].Gia
    }
  }

  ChonQuy() {
    if (this.quy.toString() === 'all') {
      this.canam = true
    } else {
      this.canam = false
      this.quy = Number.parseInt(this.quy.toString())
    }
    this.sanphams = []
    this.sanphambanduoc = []
    this.dataHighcharts = []
    this.sumAmount = 0
    this.tong_doanh_thu = 0
    this.getdsHoaDonBanHang()
  }

  ChonNam() {
    this.nam = Number.parseInt(this.nam.toString())
    if (this.quy.toString() === 'all') {
      this.canam = true
    } else {
      this.canam = false
      this.quy = Number.parseInt(this.quy.toString())
    }
    this.sanphams = []
    this.sanphambanduoc = []
    this.dataHighcharts = []
    this.sumAmount = 0
    this.tong_doanh_thu = 0
    this.getdsHoaDonBanHang()
  }

  RawHighcharts() {
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        height: 300,
        type: 'pie'
      },
      title: {
        text: 'Biểu đồ thể hiện sản phẩm bán được theo quý'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.2f}%</b>' // series là mảng đối tượng cần hiển thị được khai báo bên dưới
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.2f} %',
            connectorColor: 'silver'
          }
        }
      },
      series: [{
        name: 'Tỷ lệ', // các thức thể hiện ví dụ: bán ..., chiếm ...
        data: this.dataHighcharts

      }]
    };
  }

  ChiTietDanhThu(content_detail) {
    this.modalService.open(content_detail, { ariaLabelledBy: 'modal-detail', backdrop: 'static', keyboard: false, size: 'lg' });

  }
}
