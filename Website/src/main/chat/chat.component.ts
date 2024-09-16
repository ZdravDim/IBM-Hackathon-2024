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

  loseFocus() {
    (document.getElementById('message-input') as HTMLInputElement).blur();
  }

  send() {
    if (this.messages.length > 0 && this.messages[this.messages.length - 1].userMessage === true) {
      return;
    }
    const messageText = (document.getElementById('message-input') as HTMLInputElement).value;
    if (messageText) {
      this.messages.push({ text: messageText, userMessage: true });
      // call api instead of next line and await response...
      this.messages.push({ text: 'I am a bot', userMessage: false });
      (document.getElementById('message-input') as HTMLInputElement).value = '';
      (document.getElementById('message-input') as HTMLInputElement).focus();
    }
  }
}
