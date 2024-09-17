import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { browserRefresh } from '../../app/app.component';

@Component({
  selector: 'app-summarization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summarization.component.html',
  styleUrls: ['../chat/chat.component.scss', './summarization.component.scss']
})
export class SummarizationComponent {
  @ViewChild('scrollContainer') private chatContainer!: ElementRef;

  messages: any = sessionStorage.getItem('ai-attorney-summarization-messages') ? JSON.parse(sessionStorage.getItem('ai-attorney-summarization-messages')!) : [];
  requestDocument: File | null = null;

  constructor(private http: HttpService) {}

  loseFocus() {
    (document.getElementById('message-input') as HTMLInputElement).blur();
  }

  async send() {
      alert(this.requestDocument?.name);
      if (this.messages.length > 0 && this.messages[this.messages.length - 1].userMessage === true) {
      return;
    }
    const messageText = (document.getElementById('message-input') as HTMLInputElement).value;
    if (messageText && this.requestDocument) {
      this.messages.push({ text: messageText, userMessage: true });
      this.scrollToBottom();
      (document.getElementById('message-input') as HTMLInputElement).value = '';
      (document.getElementById('message-input') as HTMLInputElement).focus();
      const formData = new FormData();
      formData.append('summarizationMessage', messageText);
      formData.append('document', this.requestDocument);
      const response = await this.http.getSummarizationMessage(formData);
      this.messages.push({ text: response.responseMessage, userMessage: false });
      this.scrollToBottom();
    }
  }

  ngOnInit() {
    if (browserRefresh) {
      this.messages = [];
      this.requestDocument = null;
      sessionStorage.removeItem('ai-attorney-summarization-messages');
    }
  }

  ngOnDestroy(): void {
    if (this.messages) {
      sessionStorage.setItem('ai-attorney-summarization-messages', JSON.stringify(this.messages));
    }
  }

  private scrollToBottom(): void {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  uploadFile(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.requestDocument = files[0];
    }
  }
}
