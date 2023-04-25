export enum ModalStatus {
  VIEW,
  CREATE,
  UPDATE,
  CLOSE,
}

// Bookmark interface
export interface Bookmark {
  id: number | null;
  title: string;
  url: string;
  favicon: string;
  category: string;
}
