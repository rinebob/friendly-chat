import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FriendlyChatBaseComponent } from '../friendly-chat-base/friendly-chat-base.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [AsyncPipe, RouterModule],
})
export class HeaderComponent extends FriendlyChatBaseComponent {
  
}
