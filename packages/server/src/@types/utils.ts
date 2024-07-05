import type { NOT_MODIFIED_SIGNAL } from '../constants.js';

export type TypedOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type If<TCondition, TExpected, TTrue, TFalse> =
  TCondition extends TExpected ? TTrue : TFalse;

type CamelCase<TString extends string> =
  TString extends `${infer BeforeUndescore}_${infer AfterUnderscore}${infer RemainingString}`
    ? `${Lowercase<BeforeUndescore>}${Uppercase<AfterUnderscore>}${CamelCase<RemainingString>}`
    : Lowercase<TString>;

export type TransformRecordToCamelCase<T> = {
  [K in keyof T as CamelCase<K & string>]: T[K] extends Date
    ? string
    : T[K] extends {}
    ? TransformRecordToCamelCase<T[K]>
    : T[K];
};

export type AddStringToDates<T> = T extends Date ? Date | string : T;

export type SelectiveUpdate<T> = {
  [P in keyof T]?: T[P] | typeof NOT_MODIFIED_SIGNAL;
};
