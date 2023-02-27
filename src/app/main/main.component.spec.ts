import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MainComponent} from './main.component';
import {ChatContainerComponent} from "./chat-container/chat-container.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ApolloTestingModule} from "apollo-angular/testing";
import {CHANNELS, USERS} from "./services/data.service";
import {By} from "@angular/platform-browser";


describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, ApolloTestingModule],
      declarations: [MainComponent, ChatContainerComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initial user', function () {
    const result = component.userForm.value.selectUser;
    expect(result).toEqual(USERS[0] as any);
  });

  it('should select user3', function () {
    let select: HTMLSelectElement = fixture.debugElement.query(By.css('.form-control')).nativeElement;
    select.value = select.options[2].value;
    select.dispatchEvent(new Event('change'));
    const result = component.userForm.value.selectUser;
    expect(result).toEqual(USERS[2] as any);
  });

  it('should initial channel', function () {
    let elementChannel = fixture.debugElement.query(By.css('.channel')).nativeElement;
    expect(elementChannel.textContent).toContain(CHANNELS[0].name);
  });

  it('should select LGTM channel', function () {
    let elementChannel3 = fixture.debugElement.queryAll(By.css('.channel'))[2].nativeElement;
    elementChannel3.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(elementChannel3.classList).toContain('active-user');
  });
});
