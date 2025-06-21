import { CategoryModel, PaymentModeModel, SubcategoryModel } from "../db/model/models";

export type ExpenseType = {
    id?: string;
    date: string;
    category: string | CategoryModel;
    subcategory: string | SubcategoryModel;
    amount: number;
    paymentMode: string | PaymentModeModel;
    notes: string;
  };

export type ExpenseViewModel = {
  id: string;
  date: string;
  amount: number;
  notes: string;
  category: CategoryModel;
  subcategory: SubcategoryModel;
  paymentMode: PaymentModeModel;
  // categoryId: string;
  // subcategoryId: string;
  // paymentModeId: string;
  // categoryName: string;
  // subcategoryName: string;
  // paymentModeName: string;
};