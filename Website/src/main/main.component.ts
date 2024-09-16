import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

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