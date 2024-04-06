import { AppService } from '../app.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LogComponent } from '../log/log.component';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BaseUrl, IResponse, LocalUrl, TCheckPush } from '../config';
import { PlatformLocation } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';

/**
 * 送推播內容給後端
 */
@Component({
  selector: 'app-push',
  standalone: true,
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, LogComponent],
})
export class PushComponent implements OnInit, OnDestroy {
  subscription: Subscription | null = null;
  checkPush: TCheckPush | null = null;
  apiUrl = '';
  content = '';
  group = '';

  constructor(
    private location: PlatformLocation,
    private http: HttpClient,
    private appService: AppService
  ) {}

  ngOnInit() {
    if (!environment.production || this.location.hostname === 'localhost') {
      this.apiUrl = LocalUrl;
    }
    this.subscription = this.appService
      .isCheckPushIn()
      .subscribe((checkPush) => {
        this.checkPush = checkPush;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  reset() {
    this.content = '';
    this.group = '';
  }

  send() {
    if (this.checkPush !== 'success') return;
    console.log(993, {
      pushContent: this.getPushContent(),
      group: this.group,
    });

    this.http
      .post<IResponse>(`${this.apiUrl}${BaseUrl}/push`, {
        pushContent: this.getPushContent(),
        group: this.group,
      })
      .pipe(take(1))
      .subscribe((response: IResponse) => {
        console.log('Send Response', response);
        this.appService.nextMsg({
          target: 'push',
          states: response.result,
          detail: '',
          timestamp: response.timestamp,
        });
        this.content = '';
      });
  }

  getPushContent() {
    const o = {
      notification: {
        title: '標題ABC',
        body: this.content,
        data: {
          onActionClick: {
            default: {
              operation: 'openWindow',
              url: 'https://www.google.com/',
            },
          },
        },
      },
    };

    return JSON.stringify(o);
  }
}
