import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { AuthService } from '../../auth/auth.service';



@Component({
  selector: 'app-outbox',
  templateUrl: './outbox.component.html',
  styleUrls: ['./outbox.component.css']
})
export class OutboxComponent implements OnInit, OnDestroy {

  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  posts: Post[] = [];
  userIsAuthenticated = false;
  userMail: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getOutbox(this.postsPerPage, this.currentPage);
    this.userMail = localStorage.getItem("userMail");
    this.postsSub = this.postsService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number}) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
    });
    this.userIsAuthenticated = this.authService.getisAuth();
    /* burda ustteki satırı da ayriyetten kullanmamızın sebebi, bu sayfaya header component'tan
    geliyoruz. ordaki subscription isAuthenticated degisikliğini alıyor zaten.
    buraya asagıdaki kodda yakalanacak bi degisiklik kalmıyor. o yüzden ilk login olduğumuzda authservice'de
    doğru variable'ı saklıyoruz ve yukarda onu alıyoruz. */
    this.authStatusSub = this.authService.getAuthInfosListener()
    .subscribe(authData => {
      this.userIsAuthenticated = authData.isAuth;
      this.userMail = localStorage.getItem("userMail");
    });
  }


  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;  // pageindex 0'dan basladıgı icin 1 ekledik
    this.postsPerPage = pageData.pageSize;
    this.postsService.getOutbox(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePostOut(postId).subscribe(() => {
      this.postsService.getOutbox(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
