import {Injectable} from '@angular/core';
import {take} from "rxjs";
import {environment} from "@environment/environment";
import {HttpClient} from "@angular/common/http";
import {MessageInterface} from "@shared/interfaces/message-interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: MessageInterface[] = [
    {
      message: '',
      imgIds: ['123'],
      user: {
        id: 0,
        username: '',
        role: []
      },
      id: 0
    }
  ];

  constructor(public http: HttpClient) {
  }

  loadChatMessages(id1: number, id2: number) {
    let result: any = null
    let qwe = this.getChatMessages(id1, id2).pipe(take(1)).subscribe((data) => {
      if (data) {
        result = data
        this.messages = result;
        qwe?.unsubscribe();
      }
    });

    setTimeout(() => {
      this.messages = result;
      setTimeout(() => {
        // @ts-ignore
        document.getElementById('chatMessage').scrollTop = document.getElementById('chatMessage').scrollHeight
      }, 100)
    }, 1000)
  }

  getChatMessages(id1: number, id2: number) {
    return this.http.get(environment.backend + 'api/chat/messages/' + id1 + '/' + id2)
  }

  clearMessage() {
    this.messages = [];
  }
}
