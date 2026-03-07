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
  id: any;
  order: number;
  name: string;
  nameAr?: string;
  nameEn?: string;
  createdAt: number;
  available: boolean;
}

export interface Item {
  id: string;
  image?: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  price: string;
  priceTw?: string;
  ingredients?: string;
  ingredientsAr?: string;
  ingredientsEn?: string;
  categoryId: string;
  visible: boolean;
  createdAt: number;
  star?: boolean;
}
