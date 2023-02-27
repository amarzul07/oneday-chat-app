import {Component, OnInit} from '@angular/core';
import {Channel, DataService, initialChannel, initialUser, User} from "./services/data.service";
import {FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  users: User[] = [];
  selectedUser: User = initialUser;

  userForm = this.formBuilder.group({
    selectUser: [undefined, {updateOn: 'change'}]
  });

  channels: Channel[] = [];
  selectedChannel: Channel = initialChannel;

  constructor(private formBuilder: FormBuilder, private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.getUsers().subscribe(users => {
      this.users = users;
      this.selectedUser = users[0];
      this.selectUser.setValue(this.selectedUser ? this.selectedUser : undefined);
      this.dataService.getChannels().subscribe(channels => {
        this.channels = channels;
        this.selectedChannel = channels[0];
      });
    });
  }

  get selectUser(): FormControl {
    return this.userForm.get('selectUser') as FormControl;
  }
  

  selectChannel(channel: Channel): void {
    this.selectedChannel = channel;
  }
}
