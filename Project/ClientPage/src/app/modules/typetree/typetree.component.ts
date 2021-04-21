import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-typetree',
  templateUrl: './typetree.component.html',
  styleUrls: ['./typetree.component.scss']
})
export class TypetreeComponent implements OnInit {

  href = '';
  loaicay_id = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.href = this.router.url;
    this.loaicay_id = this.href.replace('/default/typetree/', '');
  }

}
