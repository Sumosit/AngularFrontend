import {Injectable} from '@angular/core';
import {take} from "rxjs";
import {environment} from "@environment/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageInterface} from "@shared/interfaces/message-interface";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: MessageInterface[] | any = [];

  constructor(public http: HttpClient) {
  }

  loadChatMessages(id1: number, id2: number) {
    let result: any = []
    let qwe = this.getChatMessages(id1, id2).pipe(take(1)).subscribe((data) => {
      if (data) {
        result = data
        this.messages = result;
        console.log(this.messages);
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT'

    })
    // @ts-ignore
    return this.http.get(environment.backend + 'api/chat/messages/' + id1 + '/' + id2, headers)
  }

  clearMessage() {
    this.messages = [];
  }
}
