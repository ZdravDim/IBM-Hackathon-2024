import { Component } from '@angular/core';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from "../home/home.component";
import { Subscription } from 'rxjs';
import { RefreshService } from '../services/refresh.service';

export let browserRefresh = false;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Website';

  subscription: Subscription;

  constructor(private router: Router, private refreshService: RefreshService) {
    this.subscription = router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          browserRefresh = !router.navigated;
        }
    });
  }
}
