import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { primengModules } from './shared/primeng.modules';
import { Drawer } from 'primeng/drawer';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...primengModules,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'hrhapp';

  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: Event): void {
    this.drawerRef.close(e);
    // this.visible= true;
  }

  visible: boolean = true;

  constructor(private router: Router) {}

  onChangeRoute(event: Event, path: string): void {
    event.stopPropagation();
    console.log('path', path);
    this.router.navigate([path]);
  }
}
