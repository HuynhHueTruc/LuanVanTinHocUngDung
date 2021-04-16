import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  nhanvien: any;
  constructor() { }

  ngOnInit(): void {
    this.nhanvien = JSON.parse(localStorage.getItem('loggedInAcount'));
    if (this.nhanvien.Quyen_su_dung === 'Quản lý'){
      document.getElementById('Quyen_SD').style.display = 'block';
    }else {
      document.getElementById('Quyen_SD').style.display = 'none';

    }
  }

}
