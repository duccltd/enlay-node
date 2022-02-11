export type Nullable<T> = T | null;

export type RequiredAttrs<T, K extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, K>
> &
  Required<Pick<T, K>>;

export type OptionalAttrs<T, K extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, K>
> &
  Partial<Pick<T, K>>;

export type IgnoreAttrs<T, K extends keyof T = keyof T> = T & {
  [];
};
