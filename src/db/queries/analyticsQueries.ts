import { Q } from "@nozbe/watermelondb";
import { database } from "..";

const adapter = database.adapter;

export const yearlyExpenseQuery = async (year: number) => {
  const query = `
    SELECT 
        strftime('%Y-%m', e.date) AS year_month,
        SUM(e.amount) AS total_spent
    FROM expenses e
    GROUP BY year_month
    ORDER BY year_month
  `;

  try {
    const result = await database.get('expenses').query(
      Q.unsafeSqlQuery(query)
    ).unsafeFetchRaw();
    console.log(result);
    
    return result;
  } catch (error) {
    console.error("Error executing yearly expense query:", error);
    throw error;
  }
};

export const getCategoryWiseExpenseQuery = (year: number) => {

}