import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-app-page',
    standalone: true,
    imports: [RouterModule, CommonModule ],
  templateUrl: './app-page.component.html',
//   styleUrl: './app-page.component.css'
})
export class AppPageComponent {}
