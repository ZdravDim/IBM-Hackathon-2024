import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { browserRefresh } from '../../app/app.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements AfterViewChecked {

  @ViewChild('scrollContainer') private chatContainer!: ElementRef;

  messages: any = sessionStorage.getItem('ai-attorney-chat-messages') ? JSON.parse(sessionStorage.getItem('ai-attorney-chat-messages')!) : [];

  constructor(private http: HttpService) {}

  loseFocus() {
    (document.getElementById('message-input') as HTMLInputElement).blur();
  }

  async send() {
    if (this.messages.length > 0 && this.messages[this.messages.length - 1].userMessage === true) {
      return;
    }
    const messageText = (document.getElementById('message-input') as HTMLInputElement).value;
    if (messageText) {
      this.messages.push({ text: messageText, userMessage: true });
      this.scrollToBottom();
      (document.getElementById('message-input') as HTMLInputElement).value = '';
      (document.getElementById('message-input') as HTMLInputElement).focus();
      const response = await this.http.getChatMessage(messageText);
      this.messages.push({ text: response.responseMessage, userMessage: false });
      this.scrollToBottom();
    }
  }

  ngOnInit() {
    if (browserRefresh) {
      this.messages = [];
      sessionStorage.removeItem('ai-attorney-chat-messages');
    }
  }

  ngOnDestroy(): void {
    if (this.messages) {
      sessionStorage.setItem('ai-attorney-chat-messages', JSON.stringify(this.messages));
    }
  }

  private scrollToBottom(): void {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

}
