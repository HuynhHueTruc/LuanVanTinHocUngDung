import { Component, OnInit , ChangeDetectionStrategy} from '@angular/core';
import { NbIconConfig } from '@nebular/theme';

@Component({
  selector: 'app-supports',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './supports.component.html',
  styleUrls: ['./supports.component.scss']
})
export class SupportsComponent implements OnInit {

  bellIconConfig: NbIconConfig = { icon: 'bell-outline', pack: 'eva' };

  constructor() { }

  ngOnInit(): void {
  }

}
