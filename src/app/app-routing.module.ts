import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutboxComponent } from './posts/outbox/outbox.component';
import { SendMessageComponent } from './posts/send-message/send-message.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { MyUserInfoComponent } from './auth/my-user-info/my-user-info.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { WelcomeComponent } from './posts/welcome/welcome.component';
import { InboxComponent } from './posts/inbox/inbox.component';
import { ShowUsersComponent } from './admin/show-users/show-users.component';
import { CreateUserComponent } from './admin/create-user/create-user.component';
import { UpdateUserComponent } from './admin/update-user/update-user.component';
import { ShowLogsComponent } from './admin/show-logs/show-logs.component';




const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'outbox', component: OutboxComponent, canActivate: [AuthGuard]},
  { path: 'inbox', component: InboxComponent, canActivate: [AuthGuard]},
  { path: 'send_message', component: SendMessageComponent, canActivate: [AuthGuard]},
  { path: 'send_message/:postId', component: SendMessageComponent, canActivate: [AuthGuard]},
  // yazdıgımız guard'ı bu routelar icin canActivate:[AuthGuard] ile etkinleştirdik
  { path: 'edit/:postId', component: SendMessageComponent, canActivate: [AuthGuard]},
  { path: 'myinfos', component: MyUserInfoComponent, canActivate: [AuthGuard] },
  { path: 'change_password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'show_users', component: ShowUsersComponent, canActivate: [AuthGuard] },
  { path: 'show_user_logs', component: ShowLogsComponent, canActivate: [AuthGuard] },
  { path: 'create_user', component: CreateUserComponent, canActivate: [AuthGuard] },
  { path: 'update_user/:userMail/:userId', component: UpdateUserComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard] // route'a izinsiz erişimi(url'e /create yazarak mesela) engellemek icin
})
export class AppRoutingModule {}
