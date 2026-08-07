import type { ReactNode } from "react";


export interface Column<T> {
  key: keyof T;
  title: string;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];

  children?: (row: T) => ReactNode;
}
