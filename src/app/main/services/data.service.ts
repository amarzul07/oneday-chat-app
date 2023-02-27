import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";

export interface User {
  id: number | undefined,
  name: string
}

export interface Channel {
  channelId: string,
  name: string
}

export const USERS: User[] = [
  {id: 1, name: 'Joyse'},
  {id: 2, name: 'Sam'},
  {id: 3, name: 'Russell'}
];
export const CHANNELS: Channel[] = [
  {channelId: "1", name: 'General'},
  {channelId: "2", name: 'Technology'},
  {channelId: "3", name: 'LGTM'}
]

export const initialUser = {
  id: undefined,
  name: ""
};

export const initialChannel = {
  channelId: "",
  name: ""
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() {
  }

  getUsers(): Observable<User[]> {
    const users = of(USERS);
    return users;
  }

  getChannels(): Observable<Channel[]> {
    const channels = of(CHANNELS);
    return channels;
  }
}
