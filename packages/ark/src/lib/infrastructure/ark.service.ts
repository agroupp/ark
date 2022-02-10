import { Inject, Injectable, OnDestroy, Optional } from '@angular/core';
import { distinctUntilChanged, map, Observable, ReplaySubject, Subject } from 'rxjs';

import { ArkConfig, StateBase, INITIAL_STATE, ARK_CONFIG } from '../entities';

export type UpdateStateFunction<State, UpdatedState extends Partial<State> = Partial<State>> = (
  state: State,
) => UpdatedState;

export type SelectStateFunction<State, Result> = (state: State) => Result;
export type SelectKey<State> = keyof State;

/**
 * Ark gives you an abstraction to extend to create your store.
 */
@Injectable()
export abstract class Ark<StateType extends StateBase> implements OnDestroy {
  protected state: StateType = { ...this.initialState, loading: false, error: undefined };
  protected readonly destroy$ = new Subject<void>();
  protected readonly stateSubject$ = new ReplaySubject<StateType>(1);
  protected readonly stateChangedSubject$ = new Subject<void>();

  readonly stateChanged$ = this.stateChangedSubject$.asObservable();
  readonly state$ = this.selectState(s => s);
  readonly loading$ = this.selectState(s => !!s.loading);
  readonly error$ = this.selectState(s => s.error);

  constructor(
    @Optional() @Inject(INITIAL_STATE) protected readonly initialState: StateType,
    @Optional() @Inject(ARK_CONFIG) private readonly config?: ArkConfig,
  ) {
    this.stateSubject$.next(this.state);
  }

  update(updateObj: Partial<StateType>): void;
  update(updateStateFunction: UpdateStateFunction<StateType>): void;
  update(arg: Partial<StateType> | UpdateStateFunction<StateType>): void {
    if (typeof arg === 'function') {
      this.setState({ ...this.state, ...arg(this.state) });
    } else if (typeof arg === 'object') {
      this.setState({ ...this.state, ...arg });
    }
  }

  select(): Observable<StateType>;
  select<Result>(key: SelectKey<StateType>): Observable<Result>;
  select<Result>(
    selectFunction: SelectStateFunction<StateType, Result>,
    distinctKeys?: SelectKey<StateType>[],
  ): Observable<Result>;
  select<Result>(
    arg?: SelectStateFunction<StateType, Result> | SelectKey<StateType>,
    distinctKeys?: SelectKey<StateType>[],
  ): Observable<Result | Partial<StateType>> {
    if (typeof arg === 'function') {
      let result$ = this.selectState(arg);

      if (distinctKeys?.length) {
        result$ = result$.pipe(
          distinctUntilChanged<Result>((a: Result, b: Result) => {
            const acc: boolean[] = [];

            distinctKeys.forEach(key => {
              acc.push(a?.[key as keyof Result] === b?.[key as keyof Result]);
            });

            return acc.every(Boolean);
          }),
        );
      }

      return result$;
    } else if (typeof arg === 'string') {
      return this.selectState(s => s[arg]);
    }

    return this.selectState(state => state);
  }

  getSnapshot(): StateType {
    return this.state;
  }

  setLoadingState(loading: boolean, doNotUpdateError = false): void {
    if (this.state.loading === loading) {
      return;
    }

    const state = { ...this.state, loading };

    if (loading && !doNotUpdateError) {
      state.error = undefined;
    }

    this.setState(state);
  }

  setErrorState(error: unknown, doNotUpdateLoading = false): void {
    if (this.state.error === error) {
      return;
    }

    this.setState({ ...this.state, error, loading: doNotUpdateLoading ? this.state.loading : false });
  }

  reset(): void {
    this.setState({ ...this.initialState, loading: false, error: undefined });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.stateSubject$.complete();
    this.stateChangedSubject$.complete();
  }

  protected setState(state: StateType): void {
    this.state = state;
    this.stateSubject$.next(this.state);
    this.stateChangedSubject$.next();
  }

  protected selectState<Result>(selectFunction: SelectStateFunction<StateType, Result>): Observable<Result> {
    return this.stateSubject$.asObservable().pipe(
      map<StateType, Result>(state => selectFunction(state)),
      distinctUntilChanged(),
    );
  }
}
