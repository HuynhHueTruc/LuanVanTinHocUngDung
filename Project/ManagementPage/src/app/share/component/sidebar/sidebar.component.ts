import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  nhanvien: any;
  // phieudat: PhieuDatModel
  So_luong_phieu_dat = 0
  constructor() { }

  ngOnInit(): void {
    this.nhanvien = JSON.parse(localStorage.getItem('loggedInAcount'));
    if (this.nhanvien.Quyen_su_dung === 'Quản lý'){
      document.getElementById('Quyen_SD').style.display = 'block';
    }else {
      document.getElementById('Quyen_SD').style.display = 'none';

    }
    // this.getSLphieudat();
  }

// getSLphieudat(){
// this.phieudatService.getListPhieuDat().subscribe((res: any) =>{
//   this.phieudat = res.phieudats;
//   this.So_luong_phieu_dat = this.phieudat.length
// })
//}
}
