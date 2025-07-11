import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgxDhis2HttpClientService } from '../../modules/ngx-http-client/services/http-client.service';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CustomField } from '../../models/default-field.model';

@Component({
  selector: 'ngx-select-user',
  imports: [CommonModule, FormsModule, SelectModule],
  templateUrl: './ngx-select-user.component.html',
  styleUrl: './ngx-select-user.component.scss',
})
export class NgxSelectUserComponent implements OnInit {
  @Input() field!: CustomField;
  selectedUser: any;
  users$!: Observable<any>;
  @Output() username: EventEmitter<string> = new EventEmitter<string>();
  @Output() userDetails: EventEmitter<any> = new EventEmitter<any>();
  private httpClientService = inject(NgxDhis2HttpClientService);

  ngOnInit(): void {
    if (this.field.value) {
      this.users$ = this.httpClientService
        .get(`userLookup.json?query=${this.field.value}`)
        .pipe(
          map((response: any) => {
            this.selectedUser = (response?.users?.filter(
              (user: any) => user?.username === this.field?.value
            ) || [])[0];

            this.userDetails.emit(this.selectedUser);
            return response?.users;
          })
        );
    }
  }

  getUsers(event: any): void {
    this.users$ = this.httpClientService
      .get(`userLookup.json?query=${event?.filter}`)
      .pipe(map((response: any) => response?.users));
  }

  getDataValue(event: any): void {
    this.selectedUser = event;
    this.username.emit(event?.username);
    this.userDetails.emit(event);
  }
}
