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
  startingAfter: string;
  endingBefore: string;
};

export interface Paginated<T> {
  object: string;
  url: string;
  hasMore: boolean;
  data: T[];
}

export interface PerformanceQuery {
  startTime: string;
  endTime?: string;
  interval: string;
}