import { Subscription } from 'rxjs/internal/Subscription';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, PlatformLocation } from '@angular/common';
import { from } from 'rxjs/internal/observable/from';
import { concatMap, take } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { AppService } from '../app.service';
import { LogComponent } from '../log/log.component';
import { Observable } from 'rxjs/internal/Observable';
import { SwPush } from '@angular/service-worker';
import { environment } from '../../environments/environment';
import { BaseUrl, IResponse, LocalUrl } from '../config';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

/**
 * 1.瀏覽器跳出權限視窗
 * 2.拿service worker產生的認證物件
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, FormsModule, LogComponent],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  subscription: Subscription | null = null;
  registration: ServiceWorkerRegistration | null = null;
  notificationPermission: NotificationPermission = 'default';
  apiUrl = '';
  group = '';

  constructor(
    private location: PlatformLocation,
    private appService: AppService,
    private http: HttpClient,
    private swPush: SwPush
  ) {}

  ngOnInit() {
    console.log(environment.production, this.location.hostname);
    if (!environment.production || this.location.hostname === 'localhost') {
      this.apiUrl = LocalUrl;
    }

    this.swPush.messages.subscribe((message) => {
      console.log('swPush messages ', message);
    });

    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      console.log('swPush notificationClicks', { action, notification });
    });

    this.subscription = this.appService
      .isSWRegistrationIn()
      .subscribe((registration) => {
        this.registration = registration;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  requestPermission() {
    if (!this.registration) return;
    // 瀏覽器跳出是否允許通知
    const permission$: Observable<NotificationPermission> = from(
      Notification.requestPermission()
    );

    // 此網站推播的訂閱物件
    const requestSubscription$: Observable<PushSubscription> = from(
      this.swPush.requestSubscription({
        serverPublicKey: environment.publicKey,
      })
    );

    const notification$ = permission$.pipe(
      concatMap((notificationPermission: NotificationPermission | null) => {
        if (notificationPermission) {
          this.notificationPermission = notificationPermission;
        }
        if (this.notificationPermission === 'granted') {
          this.registration!.showNotification('感謝您按下允許！');
          return requestSubscription$;
        } else {
          console.log('notificationPermission denied!!');
          this.appService.nextCheckPush('permissionNot');
          return of(null);
        }
      })
    );

    notification$
      .pipe(take(1))
      .subscribe((pushSubscription: PushSubscription | null) => {
        console.log('pushSubscription::', pushSubscription);
        if (pushSubscription) {
          this.registerNotification(pushSubscription);
        } else {
          this.appService.nextCheckPush('tokenNot');
        }
      });
  }

  registerNotification(pushSubscription: PushSubscription) {
    console.log(992, {
      pushSubscription: pushSubscription,
      group: this.group,
    });
    this.http
      .post<IResponse>(`${this.apiUrl}${BaseUrl}/register`, {
        pushSubscription: pushSubscription,
        group: this.group,
      })
      .pipe(take(1))
      .subscribe((response: IResponse) => {
        this.appService.nextCheckPush(
          response.result === 'success' ? response.result : 'apiNot'
        );
      });
  }
}
