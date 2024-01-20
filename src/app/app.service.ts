import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { IMsg, TCheckPush } from './config';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  msgSubject = new BehaviorSubject<IMsg | null>(null);
  swRegistratioubject = new BehaviorSubject<ServiceWorkerRegistration | null>(null);
  checkPushSubject = new BehaviorSubject<TCheckPush | null>(null);

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

  nextCheckPush(checkPush: TCheckPush) {
    this.checkPushSubject.next(checkPush);
  }

  isCheckPushIn(): Observable<TCheckPush | null> {
    return this.checkPushSubject.asObservable();
  }
}
