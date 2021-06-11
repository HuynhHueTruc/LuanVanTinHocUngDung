import { TenDanhMucNhoModel } from './../../../models/DanhMuc/TenDanhMucNho';
import { DanhMucNhoModel } from './../../../models/DanhMuc/DanhMucNho';
import { DanhmucService } from '../../../services/DanhMuc/danhmuc.service';
import { Component, OnInit } from '@angular/core';
import { DanhMucModel } from '../../../models/DanhMuc/danhmuc';

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})

export class PostsComponent implements OnInit {

  speechRecognition = window['webkitSpeechRecognition'];
  recognition = new this.speechRecognition()

  // Khi chạy constructor thì khởi tạo luôn DanhmucService
  constructor(private danhmucService: DanhmucService) { }

  ngOnInit(): void {
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'vi_VN';
    this.recognition.onstart = function (){
     document.getElementById('intrucstion').innerHTML = 'Voice Recognition is on' 
    }
    this.recognition.onspeechend = function(){
      document.getElementById('intrucstion').innerHTML = 'No Activity' 

    }
    this.recognition.onerror = function(){
      document.getElementById('intrucstion').innerHTML = 'Try again' 

    }
    this.recognition.onresult = function(event){
      const current = event.resultIndex
      const transcript = event.results[current][0].transcript
      document.getElementById('textbox').innerHTML = transcript
    }
  }

  Start(){
    this.recognition.start()
  }
  
}
