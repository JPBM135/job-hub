import type { WritableSignal } from '@angular/core';
import type { Subject } from 'rxjs';
import type { Paginated } from '../../@types/utils';

export interface BasePaginationService {
  isLoading: WritableSignal<boolean>;
  pageInfo: WritableSignal<Paginated<unknown>['pageInfo'] | undefined>;
  search$: Subject<boolean>;
  skip: WritableSignal<number>;
  take: WritableSignal<number>;
  totalCount: WritableSignal<number>;
}
