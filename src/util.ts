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
  [key in K]: never;
};

export interface QueryList {
  limit: number;
  starting_after: string;
  ending_before: string;
};

export interface Paginated<T> {
  object: string;
  url: string;
  has_more: boolean;
  data: T[];
}

export interface PerformanceQuery {
  start_time: string;
  end_time?: string;
  interval: string;
}