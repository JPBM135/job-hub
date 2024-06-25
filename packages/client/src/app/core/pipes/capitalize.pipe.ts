import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize',
  standalone: true,
})
export class CapitalizePipe implements PipeTransform {
  public transform(value: string): unknown {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
