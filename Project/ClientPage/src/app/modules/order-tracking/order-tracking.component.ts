import { PhieuDatModel } from './../../../models/PhieuDat/phieudat';
import { PhieudatService } from './../../../services/PhieuDat/phieudat.service';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss']
})
export class OrderTrackingComponent implements OnInit {

  dsphieudat: PhieuDatModel[] = []

  constructor(private phieudatService: PhieudatService) { }

  ngOnInit(): void {
    this.getdsphieudat()
  }

  getdsphieudat(){
    this.phieudatService.getListPhieuDat().subscribe((res: any) => {
      this.dsphieudat = res.phieudats;
    })
  }
}
