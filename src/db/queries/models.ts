import AsyncStorage from "@react-native-async-storage/async-storage";
import { Q } from "@nozbe/watermelondb"
import { database } from ".."
import { Alert } from "react-native"
import { CategoryModel, ExpenseModel, PaymentModeModel, SubcategoryModel } from "../model/models"
import { v4 as uuidv4 } from 'uuid';
import RNFS from "react-native-fs";
// Category CRUD
export const createCategory = async (key: string, displayName: string) => {  
    return database.write(() => {
        return database.get<CategoryModel>('categories').create((record) => {
            record.key = key;
            record.displayName = displayName;
        });
    });
};

export const readCategories = async () => {
    const categories = await database.get<CategoryModel>('categories').query().fetch();
    return categories;
};

export const findCategoryByKey = async (key: string) => {
  try {
    const categoryCollection = database.get<CategoryModel>('categories');
    const result = await categoryCollection.query(Q.where('key', key)).fetch();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error finding category by key:", error);
    return null;
  }
}

export const updateCategory = async (id: string, updates: { key?: string; displayName?: string }) => {
    const category = await database.get<CategoryModel>('categories').find(id);
    return database.write(() => {
        return category.update((record) => {
            if (updates.key) record.key = updates.key;
            if (updates.displayName) record.displayName = updates.displayName;
            record.updatedAt = new Date();
        });
    });
};

export const deleteCategory = async (id: string) => {
    const category = await database.get<CategoryModel>('categories').find(id);
    return database.write(() => category.destroyPermanently());
};

// Subcategory CRUD
export const createSubcategory = async (key: string, displayName: string, categoryId: string) => {
    return database.write(() => {
      return database.get<SubcategoryModel>('subcategories').create((record) => {
        record.key = key;
        record.displayName = displayName;
        (record._raw as any).category_id = categoryId;
      });
    });
  };
  
  export const readSubcategories = async (categoryId?: string) => {
    if (categoryId) {
      return database.get<SubcategoryModel>('subcategories').query(Q.where('category_id', categoryId)).fetch();
    }
    return database.get<SubcategoryModel>('subcategories').query().fetch();
  };

  export const findSubcategoryByKey = async (key: string) => {
    try {
        const subcategoryCollection = database.get<SubcategoryModel>('subcategories');
        const results = await subcategoryCollection.query(Q.where('key', key)).fetch();
        return results[0] || null;
    } catch (error) {
        console.error('Error finding subcategory by key:', key, error);
        return null;
    }
};
  
  export const updateSubcategory = async (id: string, updates: { key?: string; displayName?: string; categoryId?: string }) => {
    const subcategory = await database.get<SubcategoryModel>('subcategories').find(id);
    return database.write(() => {
      return subcategory.update((record) => {
        if (updates.key) record.key = updates.key;
        if (updates.displayName) record.displayName = updates.displayName;
        if (updates.categoryId) (record._raw as any).category_id = updates.categoryId;;
      });
    });
  };
  
  export const deleteSubcategory = async (id: string) => {
    const subcategory = await database.get<SubcategoryModel>('subcategories').find(id);
    return database.write(() => subcategory.destroyPermanently());
  };
  
  // PaymentMode CRUD
  export const createPaymentMode = async (key: string, displayName: string) => {
    return database.write(() => {
      return database.get<PaymentModeModel>('payment_modes').create((record) => {
        record.key = key;
        record.displayName = displayName;
      });
    });
  };
  
  export const readPaymentModes = async () => {
    return database.get<PaymentModeModel>('payment_modes').query().fetch();
  };
  
  export const updatePaymentMode = async (id: string, updates: { key?: string; displayName?: string }) => {
    const paymentMode = await database.get<PaymentModeModel>('payment_modes').find(id);
    return database.write(() => {
      return paymentMode.update((record) => {
        if (updates.key) record.key = updates.key;
        if (updates.displayName) record.displayName = updates.displayName;
      });
    });
  };
  
  export const deletePaymentMode = async (id: string) => {
    const paymentMode = await database.get<PaymentModeModel>('payment_modes').find(id);
    return database.write(() => paymentMode.destroyPermanently());
  };
  
  // Expense CRUD
  export const createExpense = async (
    date: string,
    categoryId: string,
    subcategoryId: string,
    amount: number,
    paymentModeId: string,
    notes: string
  ) => {
    return database.write(() => {
      return database.get<ExpenseModel>('expenses').create((record) => {
        record.date = date;
        (record._raw as any).category_id = categoryId;
        (record._raw as any).subcategory_id = subcategoryId;
        record.amount = amount;
        (record._raw as any).payment_mode_id = paymentModeId;
        record.notes = notes;
      });
    });
  };
  
  export const readExpenses = async () => {
    return database.get<ExpenseModel>('expenses').query(Q.sortBy('created_at', Q.desc)).fetch();
  };

  export const findPaymentModeByKey = async (key: string) => {
    try {
        const paymentModeCollection = database.get<PaymentModeModel>('payment_modes');
        const results = await paymentModeCollection.query(Q.where('key', key)).fetch();
        return results[0] || null;
    } catch (error) {
        console.error('Error finding payment mode by key:', key, error);
        return null;
    }
};
  
  export const updateExpense = async (
    id: string,
    updates: {
      date?: string;
      categoryId?: string;
      subcategoryId?: string;
      amount?: number;
      paymentModeId?: string;
      notes?: string;
    }
  ) => {
    const expense = await database.get<ExpenseModel>('expenses').find(id);
    return database.write(() => {
      return expense.update((record) => {
        if (updates.date) record.date = updates.date;
        if (updates.categoryId) (record._raw as any).category_id = updates.categoryId;
        if (updates.subcategoryId) (record._raw as any).subcategory_id = updates.subcategoryId;
        if (updates.amount) record.amount = updates.amount
        if (updates.paymentModeId) (record._raw as any).payment_mode_id = updates.paymentModeId;
        if (updates.notes) record.notes = updates.notes;
      });
    });
  };
  
  export const deleteExpense = async (id: string) => {
    const expense = await database.get<ExpenseModel>('expenses').find(id);
    return database.write(() => expense.destroyPermanently());
  };


  export const exportDataToJson = async () => {
    const categories = await readCategories();
    const subcategories = await readSubcategories();
    const paymentModes = await readPaymentModes();
    const expenses = await readExpenses();

    return JSON.stringify({
      lastSyncTimestamp: new Date().toISOString(),
      categories: categories.map(cat => cat._raw),
      subcategories: subcategories.map(sub => sub._raw),
      paymentModes: paymentModes.map(pm => pm._raw),
      expenses: expenses.map(exp => exp._raw),
    });
  }

export const exportDataBase = async () => {
  const categories = await database.get<CategoryModel>('categories').query().fetch()
  const subcategories = await database.get<SubcategoryModel>('subcategories').query().fetch()
  const paymentModes = await database.get<PaymentModeModel>('payment_modes').query().fetch()
  const expenses = await database.get<ExpenseModel>('expenses').query().fetch()

  const serialize = (records: any[]) =>
    records.map(record => ({
      id: record.id,
      ...record._raw, // or record.fields if you want to manually pick
    }))

  const data = {
    categories: serialize(categories),
    subcategories: serialize(subcategories),
    paymentModes: serialize(paymentModes),
    expenses: serialize(expenses),
  }

  const path = `${RNFS.DocumentDirectoryPath}/backup.json`
  await RNFS.writeFile(path, JSON.stringify(data), 'utf8')
  console.log("Database exported to", path)
  return path
}


export const clearDatabase = async () => {
  try {
    await database.write(async () => {
      const categories = await database.get('categories').query().fetch();
      const subcategories = await database.get('subcategories').query().fetch();
      const paymentModes = await database.get('payment_modes').query().fetch();
      const expenses = await database.get('expenses').query().fetch();

      await Promise.all(categories.map(record => record.destroyPermanently()));
      await Promise.all(subcategories.map(record => record.destroyPermanently()));
      await Promise.all(paymentModes.map(record => record.destroyPermanently()));
      await Promise.all(expenses.map(record => record.destroyPermanently()));
    });
    // await AsyncStorage.setItem('db_seeded', 'false');
    await AsyncStorage.setItem('db_seeded', 'false');
    console.log('All data cleared successfully.');

  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};


export const restoreFromBackup = async (filePath: string) => {
  try {
    const fileContent = await RNFS.readFile(filePath, 'utf8');
    const backupData = JSON.parse(fileContent);

    const categoryMap = new Map();
    const subcategoryMap = new Map();
    const paymentModeMap = new Map();

    // Restore Categories
    await Promise.all(
      backupData.categories.map(async (category: any) => {
        const newCategory = await createCategory(category.key, category.display_name);
        categoryMap.set(category.id, newCategory.id);
      })
    );

    // Restore Subcategories
    await Promise.all(
      backupData.subcategories.map(async (subcategory: any) => {
        const categoryId = categoryMap.get(subcategory.category_id);
        if (!categoryId) {
          console.warn(`Category ID not found for subcategory ${subcategory.key}`);
          return;
        }
        const newSubcategory = await createSubcategory(subcategory.key, subcategory.display_name, categoryId);
        subcategoryMap.set(subcategory.id, newSubcategory.id);
      })
    );

    // Restore Payment Modes
    await Promise.all(
      backupData.paymentModes.map(async (mode: any) => {
        const newMode = await createPaymentMode(mode.key, mode.display_name);
        paymentModeMap.set(mode.id, newMode.id);
      })
    );

    // Restore Expenses
    await Promise.all(
      backupData.expenses.map(async (expense: any) => {
        const categoryId = categoryMap.get(expense.category_id);
        const subcategoryId = expense.subcategory_id ? subcategoryMap.get(expense.subcategory_id) : null;
        const paymentModeId = paymentModeMap.get(expense.payment_mode_id);

        if (!categoryId || !paymentModeId) {
          console.warn(`Missing mapping for expense on ${expense.date}`);
          return;
        }

        await createExpense(
          expense.date,
          categoryId,
          subcategoryId,
          expense.amount,
          paymentModeId,
          expense.notes
        );
      })
    );

    console.log("Database restored successfully from backup.");

  } catch (error) {
    console.error("Error restoring from backup:", error);
  }
};








