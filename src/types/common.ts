export type EntityId = string | number;

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last?: boolean;
}
