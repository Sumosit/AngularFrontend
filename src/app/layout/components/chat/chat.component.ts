import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from "@environment/environment";
import {Stomp, StompSubscription} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {HttpClient, HttpEventType, HttpHeaders, HttpResponse} from "@angular/common/http";
import {ChatService} from "@layout/components/chat/chat.service";
import {Observable, Subscription, take} from "rxjs";
import {MessageInterface} from "@shared/interfaces/message-interface";
import {FormBuilder, FormGroup} from "@angular/forms";
import {FileUploadService} from "@shared/services/file-upload.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  users = [1, 2, 3, 4, 5, 6, 7, 8]
  currentChoose = 0;

  public formChat: FormGroup;

  // message: string = '';
  you = 1
  recipient = 5
  chatSubscription: StompSubscription | undefined;
  disabled = true;
  name: string | undefined;
  private stompClient: any;
  chatSubscribe: Subscription | undefined;

  // upload files
  selectedFiles?: FileList | any;
  filesUploaded: any[] = [];
  currentFile?: File;
  progress: any = [];
  fileInfos?: Observable<any>;
  modalMedia: boolean = false;
  modalMediaLink: string = '';
  modalImgId: string = '';
  fileDrag: boolean = false;
  finalUpload = false


  constructor(public http: HttpClient,
              public chatService: ChatService,
              private formBuilder: FormBuilder,
              private uploadService: FileUploadService) {
    this.formChat = formBuilder.group({
      "chatMessage": ["", []],
    })
  }

  ngOnInit(): void {
    this.chatService.clearMessage();
    this.chatService.loadChatMessages(this.you, this.recipient);
    this.subscribeToChat(this.you, this.recipient)
  }

  get chatMessage() {
    return this.formChat.controls['chatMessage'].value;
  }

  getBackendUrl() {
    return environment.backend
  }

  chooseUser(id: number) {
    if (this.currentChoose === 0 && id !== this.recipient) {
      this.you = id
      this.currentChoose = 1;
    } else if (this.currentChoose === 1 && id !== this.you) {
      this.recipient = id
      this.currentChoose = 0;
    }
    this.chatService.clearMessage();
    this.chatService.loadChatMessages(this.you, this.recipient);
    this.subscribeToChat(this.you, this.recipient)
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;
    if (connected) {
      this.chatService.messages = [];
    }
  }

  subscribeToChat(id: number, id2: number) {
    const socket = new SockJS(environment.sockjs_url, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'
    });
    this.stompClient = Stomp.over(socket);
    this.stompClient.debug = function () {
    };

    const _this = this;
    this.stompClient.connect({}, function (frame: string) {
      _this.setConnected(true);

      _this.chatSubscription = _this.stompClient.subscribe('/topic/chat/' + _this.you + '/' + _this.recipient, function (hello: { body: string; }) {
        // console.log(_this.chatService.messages)
        // console.log(JSON.parse(hello.body));
        let message: MessageInterface = JSON.parse(hello.body)
        message.imgIds = message.imgIds ?? [];
        _this.chatService.messages.push(message);
        setTimeout(() => {
          // @ts-ignore
          document.getElementById('chatMessage').scrollTop = document.getElementById('chatMessage').scrollHeight
        }, 100)
      });
    });
  }

  sendChatMessage() {
    if (this.selectedFiles) {
      this.upload();
    } else {
      const message = this.chatMessage;
      this.sendStompClient(message, null)
    }
  }

  sendChatMessageImages() {
    if (this.filesUploaded.length === this.selectedFiles.length) {
      const message = this.chatMessage
      console.log(this.filesUploaded)
      this.sendStompClient(message, this.filesUploaded)
      this.clearFiles()
    }
  }

  openMedia(imgId: string) {
    this.modalImgId = imgId;
    this.modalMediaLink = imgId;
    this.modalMedia = true;
    let mediaInChat = document.getElementById(imgId);
    let mediaFull = document.getElementById('media-full')
    setTimeout(() => {
      mediaFull = document.getElementById('media-full');
      // console.log(mediaInChat)
      // console.log(mediaFull)
      if (mediaInChat && mediaFull) {
        // mediaFull.style.top = mediaInChat.getBoundingClientRect().top + 'px';
        // mediaFull.style.left = mediaInChat.getBoundingClientRect().left + 'px';
        // mediaFull.style.maxWidth = mediaInChat.style.width;
        // mediaFull.style.maxHeight = mediaInChat.style.height;

        setTimeout(() => {
          if (mediaFull && mediaInChat) {
            mediaFull.style.transition = 'all 0.3s';
            mediaFull.style.top = '50%';
            // mediaFull.style.marginTop = 0 - mediaInChat.offsetHeight / 2 + 'px';
            // console.log((screen.width - mediaFull.getBoundingClientRect().width) / 2)
            // mediaFull.style.left = (screen.width - mediaFull.getBoundingClientRect().width) / 2 + 'px';
            mediaFull.style.maxWidth = '80vw';
            mediaFull.style.maxHeight = '700px';
          }
        }, 0)
      }
    }, 100)
  }

  getWidth() {
    let mediaInChat = document.getElementById(this.modalImgId);
    let mediaFull = document.getElementById('media-full')
    if (mediaInChat && mediaFull) {
      return (screen.width / 2) - (mediaFull.clientWidth * 2) + 'px';
    } else return '0px';
  }

  sendStompClient(message: string, images: any) {
    this.formChat.reset();

    if (message.length > 1) {
      this.stompClient.send(
        '/app/chat/' + this.you + '/' + this.recipient, {},
        JSON.stringify({
          message: message,
          imgIds: images
        })
      );
    }
  }

  saveMessage(message: MessageInterface) {
    console.log(message)
    this.chatService.messages.push(message);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  onDropSuccess(event: any) {
    event.preventDefault();
    console.log(event.dataTransfer.files)
    this.selectedFiles = event.dataTransfer.files;
    if (this.selectedFiles) {
      setTimeout(() => {
        // @ts-ignore
        document.getElementById("images-input").focus();
      }, 500)
    }
    this.upload();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    // if (this.selectedFiles) {
    //   setTimeout(() => {
    //     // @ts-ignore
    //     document.getElementById("images-input").focus();
    //   }, 500)
    // }
    setTimeout(() => {
      this.upload();
    }, 500)
  }

  clearFiles() {
    this.selectedFiles = undefined;
    this.filesUploaded = [];
  }

  getProgress(i: number) {
    return this.progress[i];
  }

  upload(): void {
    this.progress = 0;
    this.currentFile = this.selectedFiles.item(0);
    // console.log(this.currentFile);
    this.uploadService.upload(this.currentFile).subscribe(
      event => {
        // console.log(event);
        if (event.type === HttpEventType.UploadProgress) {
          // @ts-ignore
          this.progress = Math.round(100 * event.loaded / event.total);

        } else if (event instanceof HttpResponse) {
          console.log(event.body.message)
          this.fileInfos = this.uploadService.getFiles();
        }
      },
      err => {
        // console.log(err)
        this.progress = 0;
        this.currentFile = undefined;
      });
    this.selectedFiles = undefined;
  }

  ngOnDestroy(): void {
    this.chatSubscription?.unsubscribe();
  }
}
