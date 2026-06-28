import { Part } from "./Part";

export interface SearchPartResponse {
  page: number;
  pageSize: number;
  total: number;
  parts: Part[];
}
