import { CommonModule } from '@angular/common';
import {
  type AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  computed,
} from '@angular/core';
import { debounce } from '../../core/utils/debounce.js';
import type { BasePaginationService } from './pagination.type.js';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class PaginationComponent<T extends BasePaginationService>
  implements AfterViewInit
{
  @Input({
    required: true,
  })
  public service!: T;

  public hasNextPage = computed<boolean>(this.computeNextPage.bind(this));

  public intersectionObserver?: IntersectionObserver;

  public debouncedNextPage = debounce(this.nextPage.bind(this), 200);

  @ViewChild('divInterceptor')
  public divInterceptor!: ElementRef<HTMLDivElement>;

  public ngAfterViewInit(): void {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting && this.hasNextPage()) {
        this.debouncedNextPage();
      }
    });

    this.intersectionObserver.observe(this.divInterceptor.nativeElement);
  }

  public async changePaginationSize(size: number): Promise<void> {
    this.service.take.update(() => size);
    this.service.skip.update(() => 0);
    this.service.search$.next(true);
  }

  public async nextPage(): Promise<void> {
    this.service.skip.update(
      (skip: number) => skip + Number(this.service.take()),
    );
    this.service.search$.next(true);
  }

  public async previousPage(): Promise<void> {
    this.service.skip.update(
      (skip: number) => skip - Number(this.service.take()),
    );
    this.service.search$.next(true);
  }

  private computeNextPage() {
    return (
      this.service.totalCount() > this.service.skip() + this.service.take()
    );
  }
}
