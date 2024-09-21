import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          sessionStorage.removeItem('ai-attorney-chat-messages');
          sessionStorage.removeItem('ai-attorney-summarization-messages');
        }
      }
    });

    window.addEventListener('unload', (event) => {
      sessionStorage.removeItem('ai-attorney-chat-messages');
      sessionStorage.removeItem('ai-attorney-summarization-messages');
      event.preventDefault();
    });
  }
}
