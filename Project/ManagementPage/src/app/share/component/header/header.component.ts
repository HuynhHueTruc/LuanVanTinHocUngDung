import { NhanvienService } from './../../../../services/NhanVien/nhanvien.service';
import { NbSidebarService } from '@nebular/theme';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  nameAccount: string;
  linkImgAccount: string;
  datalogin: any;

  constructor(private sidebarService: NbSidebarService, private NVService: NhanvienService) { }

  ngOnInit(): void {
    this.datalogin = JSON.parse(localStorage.getItem('loggedInAcount'));
    if (this.NVService.loggedInStatus === true){
      this.linkImgAccount = '../../../../assets/images/avata.png';
      this.nameAccount = this.datalogin.Ho_ten;
    }
  }

  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }

  toggleSideBar(){
    // const mySidebar =  document.getElementById('mySidebar').style.display;
    // if (mySidebar === 'none'){
    //   document.getElementById('mySidebar').style.display = 'block';
    //   document.getElementById('w3-container').style.marginLeft = '200px';

    //   }else{
    //     document.getElementById('mySidebar').style.display = 'none';
    //   }
    this.toggleSideBarForMe.emit();
    }

  Logout(){
    this.NVService.logout();
  }

}
