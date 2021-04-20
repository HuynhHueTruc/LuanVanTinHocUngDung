import { StoreComponent } from './../../modules/store/store.component';
import { ProductComponent } from './../../modules/product/product.component';
import { CartComponent } from './../../modules/cart/cart.component';
import { ChangepasswordComponent } from './../../modules/changepassword/changepassword.component';
import { CustomerinfoComponent } from './../../modules/customerinfo/customerinfo.component';
import { ProfileComponent } from './../../modules/profile/profile.component';
import { ErrorComponent } from './../../modules/error/error.component';
import { LiftnavComponent } from './../../modules/liftnav/liftnav.component';
import { FormsModule } from '@angular/forms';
import { IntroComponent } from './../../modules/intro/intro.component';
import { ContentComponent } from './../../modules/content/content.component';
import { PostsComponent } from './../../modules/posts/posts.component';
import { DashboardComponent } from './../../modules/dashboard/dashboard.component';
import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultComponent } from './default.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule, HttpHeaders} from '@angular/common/http';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    PostsComponent,
    ContentComponent,
    IntroComponent,
    LiftnavComponent,
    LoginComponent,
    ErrorComponent,
    ProfileComponent,
    CustomerinfoComponent,
    ChangepasswordComponent,
    CartComponent,
    ProductComponent,
    StoreComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    // BackButtonDisableModule.forRoot({
    //   preserveScrollPosition: true
    // })
  ]
})
export class DefaultModule { }
