// types.ts
export type PopupType =
  | "logout"
  | "addCategory"
  | "deleteCategory"
  | "editItem"
  | "deleteItem"
  | null;

export interface PopupState {
  type: PopupType;
  id?: string;
}

export interface Category {
  name: string;
  createdAt: number;
  available: boolean;

}

export interface Item {
  name: string;
  price: string;
  priceTw?: string;
  ingredients?: string;
  categoryId: string;
  visible: boolean;
  createdAt: number;
}
