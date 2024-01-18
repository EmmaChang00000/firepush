import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timestamp', standalone: true })
export class TimestampPipe implements PipeTransform {
  transform(value: number): string {
    const date = new Date(value);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${year}-${month < 10 ? '0' : ''}${month}-${
      day < 10 ? '0' : ''
    }${day} ${hour}:${minute}:${second}`;
  }
}
