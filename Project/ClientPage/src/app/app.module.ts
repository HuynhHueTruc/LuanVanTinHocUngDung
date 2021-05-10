import { RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { DanhmucService } from '../services/DanhMuc/danhmuc.service';
import { SharedModule } from './shared/shared.module';
import { DefaultModule } from './layouts/default/default.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { DefautGuard } from '../guard/defaut.guard';
import { NbThemeModule, NbLayoutModule, NbInputModule, NbTabsetModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import {IvyCarouselModule} from 'angular-responsive-carousel';

@NgModule({
  // Khai báo các component, directive, pile của module này
  declarations: [
    AppComponent,
  ],
  // Nạp các module khác mà module này cần
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    DefaultModule,
    FontAwesomeModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbEvaIconsModule,
    RouterModule,
    NbInputModule,
    NbTabsetModule,
    IvyCarouselModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  // Các dịch vụ, mà các component khác có thể sử dụng
  providers: [
     DanhmucService,
     DefautGuard
    ], // Có thể là module cho đăng ký thành viên vì nó được gọi bất kỳ lúc nào
  bootstrap: [AppComponent] // Định nghĩa component gốc của module
})
export class AppModule {
  faCoffe = faCoffee;
}
