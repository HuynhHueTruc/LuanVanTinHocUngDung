import { ErrorComponent } from './../../modules/error/error.component';
import { LiftnavComponent } from './../../modules/liftnav/liftnav.component';
import { FormsModule } from '@angular/forms';
import { IntroComponent } from './../../modules/intro/intro.component';
import { ContentComponent } from './../../modules/content/content.component';
import { PostsComponent } from './../../modules/posts/posts.component';
import { RouterModule } from '@angular/router';
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

@NgModule({
  declarations: [
    DefaultComponent,
    DashboardComponent,
    PostsComponent,
    ContentComponent,
    IntroComponent,
    LiftnavComponent,
    LoginComponent,
    ErrorComponent
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
