import { Injectable, OnDestroy } from '@angular/core';
import { map, Observable, of, Subject, takeUntil, tap, switchMap } from 'rxjs';

import { StateBase } from '../entities/state-base';
import { Ark } from './ark.service';

@Injectable()
export abstract class ArkFacade<StateType extends StateBase> implements OnDestroy {
  protected readonly destroy$ = new Subject<void>();

  readonly loading$ = this.store.loading$;
  readonly error$ = this.store.error$;

  constructor(protected readonly store: Ark<StateType>) {}

  /**
   * Creates an effect.
   *
   * @param effectFunction A function that takes some data and returns observable effect
   * will subscribe to. If you need to update the store or handle error, you must do it
   * inside your `effectFunction`. The loading state will be triggered automatically.
   * @returns A function to be called with `providedData` to trigger `effectFunction`
   * observable.
   */
  createEffect<ProvidedDataType>(
    effectFunction: (providedData: ProvidedDataType) => Observable<unknown>,
  ): (providedData: ProvidedDataType) => void {
    const providedData$ = new Subject<ProvidedDataType>();

    providedData$
      .pipe(
        switchMap(data => effectFunction(data)),
        tap(() => this.store.setLoadingState(false)),
      )
      .subscribe();

    return (providedData: ProvidedDataType) => {
      return of(providedData)
        .pipe(
          map(value => {
            this.store.setLoadingState(true);
            return value;
          }),
          takeUntil(this.destroy$),
        )
        .subscribe(value => providedData$.next(value));
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
