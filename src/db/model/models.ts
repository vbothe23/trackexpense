import { Model, Q } from '@nozbe/watermelondb';
import { field, date, relation, readonly, children } from '@nozbe/watermelondb/decorators';
import { Associations } from '@nozbe/watermelondb/Model';

// Category Model
export class CategoryModel extends Model {
  static table = 'categories';               

  /* @ts-ignore */
  @field('key') key!: string;
  // @ts-ignore
  @field('display_name') displayName!: string;
  // @ts-ignore
  @readonly @date('created_at') createdAt!: Date; // Converts number (Unix timestamp) to Date object
  // @ts-ignore
  @readonly @date('updated_at') updatedAt!: Date;

  // @ts-ignore
  @children('sub_categories') subCategories;
  // @ts-ignore
  @children('expenses') expenses;
}

// Subcategory Model
export class SubcategoryModel extends Model {
  static table = 'subcategories';

  // @ts-ignore
//   @field('id') id!: string;
  // @ts-ignore
  @field('key') key!: string;
  // @ts-ignore
  @field('display_name') displayName!: string;
  // @ts-ignore
  @readonly @date('created_at') createdAt!: Date; // Converts number (Unix timestamp) to Date object
  // @ts-ignore
  @readonly @date('updated_at') updatedAt!: Date;

  // @ts-ignore
  @relation('categories', 'category_id') category!: Category;

  // @ts-ignore
  @children('expenses') expenses;

}

// PaymentMode Model
export class PaymentModeModel extends Model {
  static table = 'payment_modes';

  // @ts-ignore
  @field('key') key!: string;
  // @ts-ignore
  @field('display_name') displayName!: string; // Converts number (Unix timestamp) to Date object
  // @ts-ignore
  @readonly @date('created_at') createdAt!: Date;
  // @ts-ignore
  @readonly @date('updated_at') updatedAt!: Date;

  // @ts-ignore
  @children('expenses') expenses;
}

// Expense Model
export class ExpenseModel extends Model {
  static table = 'expenses';

  // @ts-ignore
  @field('date') date!: string; // ISO 8601 string
  // @ts-ignore
  @field('amount') amount!: number;
  // @ts-ignore
  @field('notes') notes!: string;
  // Converts number (Unix timestamp) to Date object
  // @ts-ignore
  @readonly @date('created_at') createdAt!: Date;
    // @ts-ignore
  @readonly @date('updated_at') updatedAt!: Date;
  // @ts-ignore
  @relation('categories', 'category_id') category!: CategoryModel;
  // @ts-ignore
  @relation('subcategories', 'subcategory_id') subcategory!: SubcategoryModel;
  // @ts-ignore
  @relation('payment_modes', 'payment_mode_id') paymentMode!: PaymentModeModel;
}