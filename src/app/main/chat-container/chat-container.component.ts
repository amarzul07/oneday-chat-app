import {AfterViewChecked, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {User, Channel, DataService, initialUser, initialChannel} from "../services/data.service";
import {FormBuilder} from "@angular/forms";
import {gql, Apollo} from 'apollo-angular'
import {LocalService} from '../services/local.service';

export const FETCH_LATEST_MESSAGES = gql`
query fetchLatestMessages($channelId: String!) {
    fetchLatestMessages(channelId: $channelId) {
      messageId
      text
      datetime
      userId
    }
  }
`;

export const POST_MESSAGE = gql`
mutation postMessage ($channelId: String!, $text: String!, $userId: String!) {
    postMessage(channelId: $channelId, text: $text, userId: $userId) {
      userId
      datetime
      text
      messageId
    }
  }
`;

export const FETCH_MORE_MESSAGES = gql`
query fetchMoreMessages ($channelId: String!, $messageId: String!, $old: Boolean!) {
    fetchMoreMessages(channelId: $channelId, messageId:  $messageId, old: $old) {
      messageId
      text
      datetime
      userId
    }
  }
`;

interface Chat {
  datetime: string,
  messageId: string,
  text: string,
  userId: string,
  isError?: boolean
}

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})

export class ChatContainerComponent implements OnInit, AfterViewChecked {
  @ViewChild("chatContainer") container = {} as ElementRef;
  @Input() user: any;
  @Input() channel: any;
  chatLatestMessages: Chat[] = [];
  error: any;
  chatMessage: string = "";

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private apollo: Apollo, private localStore: LocalService) {
  }

  ngOnInit(): void {
    this.chatMessage = this.localStore.getData('message') as string;
    this.fetchLatestMessages(this.channel.channelId);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes["user"]) this.user = changes["user"].currentValue;
    if(changes["channel"]) this.channel = changes["channel"].currentValue;
    this.fetchLatestMessages(this.channel.channelId);
  }

  ngAfterViewChecked() {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }

  fetchLatestMessages(channelId: string) {
    this.apollo.watchQuery({
      query: FETCH_LATEST_MESSAGES,
      variables: {
        channelId
      }
    }).valueChanges.subscribe(({data}: any) => {
      this.chatLatestMessages = data.fetchLatestMessages.slice().reverse();
    });
  }

  readMore(old: boolean) {
    let messageId;
    if (old) {
      messageId = this.chatLatestMessages[0]?.messageId;
    } else {
      const index = this.chatLatestMessages.length - 1;
      messageId = this.chatLatestMessages[index]?.messageId;
    }

    this.apollo.mutate({
      mutation: FETCH_MORE_MESSAGES,
      variables: {
        channelId: this.channel.channelId,
        messageId,
        old
      }
    }).subscribe({
      next: ({data}: any) => {
        if (data.fetchMoreMessages.length > 0) {
          this.chatLatestMessages = data.fetchMoreMessages;
        }
      },
      error: (error) => {
        this.error = error
      }
    })
  }

  postMessage(text: any) {
    if (text) {
      this.apollo.mutate({
        mutation: POST_MESSAGE,
        variables: {
          channelId: this.channel.channelId,
          text: text,
          userId: this.user.name,
        }
      }).subscribe({
        next: ({data}: any) => {
          this.chatMessage = '';
          this.chatLatestMessages = [...this.chatLatestMessages, data.postMessage];
          this.chatLatestMessages.slice().reverse();
        },
        error: (error) => {
          if (error.graphQLErrors[0].extensions.code == 500) {
            const data = {
              datetime: new Date().toLocaleString(),
              messageId: "",
              text: text,
              userId: this.user.name,
              isError: true
            }
            this.chatLatestMessages = [...this.chatLatestMessages, data];
            this.chatMessage = '';
          }
        }
      });
    }
  }

  storeMessage(event: string) {
    this.localStore.saveData('message', event);
  }
}
