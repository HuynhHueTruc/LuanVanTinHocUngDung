import { PhieuDatModel } from './../../../../models/PhieuDat/phieudat';
import { PhieudatService } from './../../../../services/PhieuDat/phieudat.service';
import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { timer } from 'rxjs';
import { ThongTinCuaHangModel } from 'src/models/ThongTinCuaHang/thongtincuahang';
import { ThongtincuahangService } from 'src/services/ThongTinCuaHang/thongtincuahang.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  nhanvien: any;
  phieudat: PhieuDatModel[] = []
  So_luong_phieu_dat = 0
  thongtincuahang: ThongTinCuaHangModel[] = []

  constructor(private phieudatService: PhieudatService, private thongtincuahangService: ThongtincuahangService) { }

  ngOnInit(): void {
    this.nhanvien = JSON.parse(localStorage.getItem('loggedInAcount'));
    if (this.nhanvien.Quyen_su_dung === 'Quản lý') {
      document.getElementById('Quyen_SD').style.display = 'block';
    } else {
      document.getElementById('Quyen_SD').style.display = 'none';

    }
    this.phieudatService.getRefeshPage().subscribe(() => {
      // this.getSLphieudat();
      const source = timer(1000, 5000); // Trên thực tế là 864000000 (1 ngày)
      const subscribe = source.subscribe(val => this.getSLphieudat(val)); 
    })
    this.thongtincuahangService.getRefeshPage().subscribe(() => {
      this.getThongTinCuaHang();
    })

    // this.getSLphieudat();
    const source = timer(1000, 5000); // Trên thực tế là 864000000 (1 ngày)
    const subscribe = source.subscribe(val => this.getSLphieudat(val)); 
    this.getThongTinCuaHang()
  }

  getSLphieudat(val) {
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.phieudat = res.phieudats;
      this.So_luong_phieu_dat = this.phieudat.length
    })
  }

  getThongTinCuaHang() {
    this.thongtincuahangService.getThongTinCuaHang().subscribe((res: any) => {
      this.thongtincuahang = res.cuahangs[0];
    });
  }
}
