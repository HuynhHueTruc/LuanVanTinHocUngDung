import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  setHidden(){
    console.log("abc");
    var hidden = document.getElementById('hidden');
    if(hidden.style.display === 'none')
    {
      var hidden2 = document.getElementById('hidden2');
      hidden2.style.display = 'none';
    }else{
      hidden.style.display = 'none';
    }
  }
}
