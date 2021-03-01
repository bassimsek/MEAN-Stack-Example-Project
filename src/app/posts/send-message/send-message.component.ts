import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';


import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit, OnDestroy {
  isLoading = false;
  form: FormGroup;
  post: Post;
  imagePreview: string;
  private postId: string;
  private failingStatusSub: Subscription;


  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      to: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        asyncValidators: [mimeType]
       })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
        .subscribe(postData => {
          this.isLoading = false;
          this.form.setValue({
            to: postData.from,
            title: postData.title,
            content: '',
            image: null
          });
        });
      }
    });
    this.failingStatusSub = this.postsService.getFailingListener()
    .subscribe(failing => {
      this.isLoading = false;
    });
  }


  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }


  onSendMessage () {
    if (this.form.invalid) {
      window.alert("Sending message is failed!");
      return;
    }
    this.isLoading = true;
    this.postsService.sendPost(
      this.form.value.to,
      this.form.value.title,
      this.form.value.content,
      this.form.value.image);
    this.form.reset();
  }


  ngOnDestroy() {
    this.failingStatusSub.unsubscribe();
  }
}
