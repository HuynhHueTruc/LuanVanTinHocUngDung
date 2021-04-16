import { DefautGuard } from './../guard/defaut.guard';
import { LoginComponent } from 'src/app/modules/login/login.component';
import { PostsComponent } from './modules/posts/posts.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { DefaultComponent } from './layouts/default/default.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { CommonModule } from '@angular/common';

// const routes: Routes = [{
//   path: '',
//   component: DefaultComponent,
//   children: [{
//     path: '',
//     component: DashboardComponent
//   },
//   {
//     path: 'posts',
//     component: PostsComponent
//   }]
// }];

const routes: Routes = [
   // Tự động chuyển sang trang Login khi load, set pathMatch: 'full' để tránh vòng lặp tìm path vô hạn
  { path: '', redirectTo: '/default', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // { path: 'default', component: DefaultComponent, canActivate: [DefautGuard] }
  { path: 'default', component: DefaultComponent },
  { path: 'posts', component: PostsComponent }

];

@NgModule({
  imports: [CommonModule,
    [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })]
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
