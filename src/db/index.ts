/*
 *  TODO: This is a Placeholder for license header and is to be replaced with actual header.
 *  Copyright (c) 2025 Mayo Clinic
 */

import { Database } from "@nozbe/watermelondb"
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"

import schema from "./schema"
import migrations from "./migration"
import { CategoryModel, ExpenseModel, PaymentModeModel, SubcategoryModel } from "./model/models"
// import Template from "./model/template"

const adapter = new SQLiteAdapter({
  dbName: "trackexpense",
  schema,
  migrations,
  //   jsi: true /* Platform.OS === 'ios' */,
  //   onSetUpError: (error) => {
  //     console.log(error)
  //   },
})

export const database = new Database({
  adapter,
  modelClasses: [CategoryModel, SubcategoryModel, PaymentModeModel, ExpenseModel],
})
