import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  // //sorting
  // key: string = 'name'; //set default
  // reverse: boolean = false;
  // sort(key){
  //   this.key = key;
  //   this.reverse = !this.reverse;
  // }

  // //initializing p to one
  // p: number = 1;
}
