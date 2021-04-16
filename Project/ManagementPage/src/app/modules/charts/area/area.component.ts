import { SanphamService } from './../../../../services/SanPham/sanpham.service';
import { HoadonbanhangService } from './../../../../services/HoaDonBanHang/hoadonbanhang.service';
import { SanPhamModel } from './../../../../models/SanPham/sanpham';
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
  constructor(private hoadonbanhangService: HoadonbanhangService, private sanphamService: SanphamService) { }

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
          this.sanphams.push({ SanPham_id: this.dshoadon[i].San_Pham[j].SanPham_id, So_luong: this.dshoadon[i].San_Pham[j].So_luong, Gia_ban: this.dshoadon[i].San_Pham[j].Gia_ban, Thoi_gian_ban: this.dshoadon[i].Ngay_lap })
        }
      }

      for (const i in this.sanphams) {

          if (new Date(this.sanphams[i].Thoi_gian_ban).getFullYear() === this.nam) {
            if (!this.canam){
            let month = new Date(this.sanphams[i].Thoi_gian_ban).getMonth() + 1
            if (this.XacDinhQuy(month) === this.quy) {
              this.sanphambanduoc.push(this.sanphams[i])
            }
          }else{
            this.sanphambanduoc.push(this.sanphams[i])
          }
        }

      }

      for (const count in this.sanphambanduoc) {
        this.sumAmount += this.sanphambanduoc[count].So_luong
      }


      this.getdsSanPham(this.sanphambanduoc)
      // console.log(this.sanphambanduoc)


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
  compareSanPham_id(sanphambanduoc) {
    let count = 0;
    let arr_id = []
    this.arrSanPham = []
    this.thongtinsanpham.splice(0, this.thongtinsanpham.length)
    for (const dmn in sanphambanduoc) {
      for (const sp in this.dssanpham) {
        if (sanphambanduoc[dmn].SanPham_id === this.dssanpham[sp]._id) {
          this.arrSanPham.push(this.dssanpham[sp])
        }
      }
      this.thongtinsanpham.push(this.arrSanPham[0])
      this.arrSanPham = [];
    }
    this.XoaTrungSanPham()
    this.DataHighChart()
  }

  XoaTrungSanPham() {
    const uniqueSet = new Set(this.thongtinsanpham);
    this.thongtinsanpham = [...uniqueSet];
    // console.log(this.thongtinsanpham)
  }

  DataHighChart() {
    let sum = 0;
    for (const i in this.thongtinsanpham) {
      for (const j in this.sanphambanduoc) {
        if (this.sanphambanduoc[j].SanPham_id === this.thongtinsanpham[i]._id) {
          sum += this.sanphambanduoc[j].So_luong
        }
      }
      this.dataHighcharts.push({ name: this.thongtinsanpham[i].Ten_san_pham, y: (sum * 100) / this.sumAmount, _id: this.thongtinsanpham[i]._id, Gia: this.thongtinsanpham[i].Gia })
      sum = 0
    }
    this.RawHighcharts()
    this.DoanhThu()
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
    if (this.quy.toString() === 'all'){
      this.canam = true
    }else{
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
    if (this.quy.toString() === 'all'){
      this.canam = true
    }else{
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

  RawHighcharts(){
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Thống kê sản phẩm bán được theo quý'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' // series là mảng đối tượng cần hiển thị được khai báo bên dưới
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
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
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
}
