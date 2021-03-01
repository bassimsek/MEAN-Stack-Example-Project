import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Post } from './post.model';


@Injectable({providedIn: 'root'})
export class PostsService {

  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();
  private failingListener = new Subject<boolean>();


  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) {}


 getPostUpdateListener () {
      return this.postsUpdated.asObservable();
    }

 getFailingListener() {
      return this.failingListener.asObservable();
    }


 getOutbox (postsPerPage: number, currentPage: number) {
  const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
  this.http.get<{message: string, posts: any, maxPosts: number }>("http://localhost:3000/api/posts/outbox" + queryParams)
  .pipe(map(postData => {
    return { posts: postData.posts.map(post => {
      return {
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath,
        from: post.from,
        to: post.to,
        time: post.time
      };
    }),
    maxPosts: postData.maxPosts };
  }))
  .subscribe(transformedPostsData => {
    this.posts = transformedPostsData.posts;
    this.postsUpdated.next({
      posts: [...this.posts],
      postCount: transformedPostsData.maxPosts
    });
  }, err => {
    this.router.navigate(["/"]);
  });
}


getInbox (postsPerPage: number, currentPage: number) {
  const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
  this.http.get<{message: string, posts: any, maxPosts: number }>("http://localhost:3000/api/posts/inbox" + queryParams)
  .pipe(map(postData => {
    return { posts: postData.posts.map(post => {
      return {
        title: post.title,
        content: post.content,
        id: post._id,
        imagePath: post.imagePath,
        from: post.from,
        to: post.to,
        time: post.time
      };
    }),
    maxPosts: postData.maxPosts };
  }))
  .subscribe(transformedPostsData => {
    this.posts = transformedPostsData.posts;
    this.postsUpdated.next({
      posts: [...this.posts],
      postCount: transformedPostsData.maxPosts
    });
  }, err => {
    this.router.navigate(["/"]);
  });
}



  getPost(id: string) {
    return this.http.get<{
      _id: string,
      to: string,
      from: string,
      title: string,
      content: string,
      imagePath: string}>(
      "http://localhost:3000/api/posts/" + id);
  }

  sendPost(to: string, title: string, content: string, image: File) {
     // const post: Post = {id : null, title: title, content: content};
     const from: string = this.authService.getUserMail();
     const now = new Date();
     const time = now.toLocaleString();
     const postData = new FormData();
     postData.append("title", title);
     postData.append("content", content);
     postData.append("image", image, title); // 3. arguman(title) posts.js'deki file.originalName'dir.
     postData.append("from", from);
     postData.append("to", to);
     postData.append("time", time);
    this.http.post<{ message: string, post: Post }>("http://localhost:3000/api/posts", postData)
    .subscribe((responseData) => {
      window.alert("Message is sent successfully!");
      this.router.navigate(["/"]);
    }, err => {
      this.failingListener.next(true);
    });
  }


  deletePostOut(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/outbox/" + postId);
  }

  deletePostIn(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/inbox/" + postId);
  }


  }
