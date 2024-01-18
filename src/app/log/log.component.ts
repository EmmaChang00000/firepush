import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppService } from '../app.service';
import { IMsg } from '../config';
import { TimestampPipe } from '../timestamp.pipe';

@Component({
  selector: 'app-push-log',
  standalone: true,
  imports: [CommonModule, TimestampPipe],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
})
export class LogComponent implements OnInit, OnDestroy {
  @Input() target: 'notification' | 'push' | '' = '';
  subscription: Subscription | null = null;
  logs: IMsg[] = [];

  constructor(private appService: AppService) {}

  ngOnInit() {
    const log$ = this.appService.isMsgIn();
    if (log$) {
      this.subscription = log$.subscribe((msg) => {
        if (msg && msg.target === this.target) {
          this.logs.push(msg);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
