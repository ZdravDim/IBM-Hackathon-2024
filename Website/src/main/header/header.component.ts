import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public currentUrl: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentUrl = this.router.url;
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
    this.currentUrl = url;
  }
}
