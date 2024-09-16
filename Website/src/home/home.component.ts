import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Application } from '@splinetool/runtime';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  ngOnInit() {
    const canvas = document.getElementById('canvas3d');
    const app = new Application(canvas as HTMLCanvasElement);
    // app.load('https://prod.spline.design/VATohlVJxZCCWVjJ/scene.splinecode');
    app.load('https://draft.spline.design/QB0N035UzBt6ltIG/scene.splinecode');
  }
}
