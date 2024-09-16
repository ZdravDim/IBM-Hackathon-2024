import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  messages: any = [];

  send() {
    const messageText = (document.getElementById('message-input') as HTMLInputElement).value;
    if (messageText) {
      this.messages.push({ text: messageText, userMessage: true });
      this.messages.push({ text: 'I am a bot', userMessage: false });
      (document.getElementById('message-input') as HTMLInputElement).value = '';
    }
  }
}
