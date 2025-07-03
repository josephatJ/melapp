import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { primengModules } from './shared/primeng.modules';
import { Drawer } from 'primeng/drawer';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDhis2MenuModule } from './shared/modules/ngx-dhis2-menu/ngx-dhis2-menu.module';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...primengModules,
    NgxDhis2MenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'hrhapp';
  currentMenuId = signal<string>('home');

  @ViewChild('drawerRef') drawerRef!: Drawer;

  closeCallback(e: Event): void {
    this.drawerRef.close(e);
    // this.visible= true;
  }

  visible: boolean = true;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    // const routeId: string =  this.activatedRoute.pathFromRoot;
    console.log(this.activatedRoute.snapshot);
    const routePath = location.hash.substring(1); // Removes the '#' from "#/home"
    console.log('Current path:', routePath);
    // this.currentMenuId.set(ac)
    this.activatedRoute.fragment.subscribe((fragment) => {
      console.log('Fragment:', fragment);
    });
  }

  onChangeRoute(event: Event, path: string): void {
    event.stopPropagation();
    console.log('path', path);
    this.router.navigate([path]);
  }
}
