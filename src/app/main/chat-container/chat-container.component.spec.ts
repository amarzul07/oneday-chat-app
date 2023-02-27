import {ComponentFixture, TestBed} from '@angular/core/testing';

import {
  ChatContainerComponent,
  FETCH_LATEST_MESSAGES,
  FETCH_MORE_MESSAGES,
  POST_MESSAGE
} from './chat-container.component';
import {ApolloTestingController, ApolloTestingModule} from "apollo-angular/testing";
import {FormsModule} from "@angular/forms";
import {CHANNELS, USERS} from "../services/data.service";

const MESSAGE_ID = "2";

describe('ChatContainerComponent', () => {
  let component: ChatContainerComponent;
  let fixture: ComponentFixture<ChatContainerComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ApolloTestingModule],
      declarations: [ChatContainerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ChatContainerComponent);
    component = fixture.componentInstance;
    component.channel = CHANNELS[0]
    component.user = USERS[0]
    fixture.detectChanges();
    controller = TestBed.inject(ApolloTestingController);

    component.chatLatestMessages = [{
      datetime: "test-datetime",
      messageId: MESSAGE_ID,
      text: "test",
      userId: "Sam"
    }]
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchLatestMessages on ngOnInit', function () {
    const op = controller.expectOne(FETCH_LATEST_MESSAGES);
    expect(op.operation.variables["channelId"]).toEqual(CHANNELS[0].channelId);
  });

  it('should call FETCH_MORE_MESSAGES', function () {
    const old = true;
    component.readMore(old);
    const op = controller.expectOne(FETCH_MORE_MESSAGES);
    expect(op.operation.variables["channelId"]).toEqual(CHANNELS[0].channelId);
    expect(op.operation.variables["messageId"]).toEqual(MESSAGE_ID);
    expect(op.operation.variables["old"]).toEqual(old);
  });

  it('should mutate POST_MESSAGE', function () {
    const text = 'text';
    component.postMessage(text);
    const op = controller.expectOne(POST_MESSAGE);
    expect(op.operation.variables["channelId"]).toEqual(CHANNELS[0].channelId);
    expect(op.operation.variables["userId"]).toEqual(USERS[0].name);
    expect(op.operation.variables["text"]).toEqual(text);
  });
});
