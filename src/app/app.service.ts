import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IMsg } from './config';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  msgSubject = new BehaviorSubject<IMsg | null>(null);
  swRegistratioubject = new BehaviorSubject<ServiceWorkerRegistration | null>(null);
  notificationPermissionSubject = new BehaviorSubject<NotificationPermission | null>(null);

  nextMsg(msg: IMsg) {
    this.msgSubject.next(msg);
  }

  isMsgIn(): Observable<IMsg | null> {
    return this.msgSubject.asObservable();
  }

  nextSWRegistration(swRegistration: ServiceWorkerRegistration | null) {
    this.swRegistratioubject.next(swRegistration);
  }

  isSWRegistrationIn(): Observable<ServiceWorkerRegistration | null> {
    return this.swRegistratioubject.asObservable();
  }

  nextNotificationPermission(notificationPermission: NotificationPermission) {
    this.notificationPermissionSubject.next(notificationPermission);
  }

  isNotificationPermissionIn(): Observable<NotificationPermission | null> {
    return this.notificationPermissionSubject.asObservable();
  }
}
