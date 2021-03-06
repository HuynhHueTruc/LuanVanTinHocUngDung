import { BillManagementComponent } from './../../modules/bill-management/bill-management.component';
import { OrderTrackingComponent } from './../../modules/order-tracking/order-tracking.component';
import { CheckoutComponent } from './../../modules/checkout/checkout.component';
import { DetailComponent } from './../../modules/detail/detail.component';
import { ServiceComponent } from './../../modules/service/service.component';
import { SupportsComponent } from './../../modules/supports/supports.component';
import { NotFoundComponent } from './../../modules/not-found/not-found.component';
import { TypetreeComponent } from './../../modules/typetree/typetree.component';
import { ForgotpasswordComponent } from './../../modules/forgotpassword/forgotpassword.component';
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
import { Input, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DefaultComponent } from './default.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule, HttpHeaders} from '@angular/common/http';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';
import { NbThemeModule, NbLayoutModule, NbInputModule, NbTabsetModule, NbCardModule } from '@nebular/theme';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MapComponent } from 'src/app/modules/map/map.component';
import { NgxCaptchaModule } from 'ngx-captcha';
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
    StoreComponent,
    ForgotpasswordComponent,
    TypetreeComponent,
    NotFoundComponent,
    SupportsComponent,
    ServiceComponent,
    DetailComponent,
    CheckoutComponent,
    OrderTrackingComponent,
    BillManagementComponent,
    MapComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgOtpInputModule,
    RouterModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbTabsetModule,
    NbInputModule,
    NbCardModule,
    IvyCarouselModule,
    NgxPayPalModule,
    NgbModule,
    NgxCaptchaModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class DefaultModule { }
