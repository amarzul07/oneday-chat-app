import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainComponent} from './main.component';
import {MainRoutingModule} from './main-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChatContainerComponent} from './chat-container/chat-container.component'

@NgModule({
  declarations: [
    MainComponent,
    ChatContainerComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MainModule {
}
