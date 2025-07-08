import AsyncStorage from "@react-native-async-storage/async-storage";
import { createCategory, createExpense, createPaymentMode, createSubcategory, findCategoryByKey, findPaymentModeByKey, findSubcategoryByKey } from "./queries/models";
import predefinedExpenses from "./queries/predefinedExpenses.json";

const predefinedCategories = [
    {
        key: 'necessities',
        displayName: 'Necessities',
        subcategories: [
            { key: 'food', displayName: 'Food' },
            { key: 'rent', displayName: 'Rent' },
            { key: 'housing', displayName: 'Housing' },
            { key: 'health', displayName: 'Health' },
            { key: 'transport', displayName: 'Transport' },
            { key: 'grooming', displayName: 'Grooming' }
        ]
    },
    {
        key: 'savings_investment',
        displayName: 'Savings & Investment',
        subcategories: [
            { key: 'rd', displayName: 'Recurring Deposit' },
            { key: 'fd', displayName: 'Fixed Deposit' },
            { key: 'mutual_fund', displayName: 'Mutual Fund' },
            { key: 'stocks', displayName: 'Stocks' },
            { key: 'gold', displayName: 'Gold' }
        ]
    },
    {
        key: 'enjoyment',
        displayName: 'Enjoyment',
        subcategories: [
            { key: 'hangout', displayName: 'Hangout' },
            { key: 'travel', displayName: 'Travel' },
            { key: 'food', displayName: 'Food' }
        ]
    },
    {
        key: 'education',
        displayName: 'Education',
        subcategories: []
    },
    {
        key: 'contribution',
        displayName: 'Contribution',
        subcategories: []
    },
    {
        key: 'other',
        displayName: 'Other',
        subcategories: []
    }
];

const predefinedPaymentModes = [
    { key: 'upi', displayName: 'UPI' },
    { key: 'cash', displayName: 'Cash' },
    { key: 'credit_card', displayName: 'Credit Card' },
    { key: 'debit_card', displayName: 'Debit Card' },
    { key: 'net_banking', displayName: 'Net Banking' }
]

export const seedInitialData = async () => {
    const isSeeded = await AsyncStorage.getItem('db_seeded');
    if (isSeeded === 'true') {
        console.log("Database already seeded.");
        return;
    }

    const categoryMap = new Map();
    const subcategoryMap = new Map();
    const paymentModeMap = new Map();

    // Create all categories
    await Promise.all(
        predefinedCategories.map(async (category) => {
            try {
                const newCategory = await createCategory(category.key, category.displayName);
                console.log("Category created: ", newCategory.id);
                categoryMap.set(category.key, newCategory.id);
            } catch (error) {
                console.error("Failed to create category:", category.key, error);
            }
        })
    );

    // Create all subcategories after categories
    await Promise.all(
        predefinedCategories.flatMap(category =>
            category.subcategories.map(async (subcategory) => {
                try {
                    const categoryId = categoryMap.get(category.key);
                    if (!categoryId) {
                        console.error("Category not found for subcategory:", subcategory.key);
                        return;
                    }
                    const newSubcategory = await createSubcategory(subcategory.key, subcategory.displayName, categoryId);
                    console.log("Subcategory created: ", newSubcategory.id);
                    subcategoryMap.set(`${category.key}:${subcategory.key}`, newSubcategory.id);
                } catch (error) {
                    console.error("Failed to create subcategory:", subcategory.key, error);
                }
            })
        )
    );

    // Create all payment modes
    await Promise.all(
        predefinedPaymentModes.map(async (paymentMode) => {
            try {
                const newPaymentMode = await createPaymentMode(paymentMode.key, paymentMode.displayName);
                console.log("PaymentMode created: ", newPaymentMode.id);
                paymentModeMap.set(paymentMode.key, newPaymentMode.id);
            } catch (error) {
                console.error("Failed to create payment mode:", paymentMode.key, error);
            }
        })
    );

    // Seed expenses from demoData
    console.log("Seeding expenses from demoData...");
    for (const exp of predefinedExpenses) {
        try {
            // Map keys to lowercase to match predefinedCategories and predefinedPaymentModes
            const categoryKey = exp.categoryKey.toLowerCase();
            const subcategoryKey = exp.subcategoryKey.toLowerCase();
            const paymentModeKey = exp.paymentModeKey.toLowerCase();

            // Look up IDs from maps
            const categoryId = categoryMap.get(categoryKey);
            const subcategoryId = subcategoryKey ? subcategoryMap.get(`${categoryKey}:${subcategoryKey}`) : null;
            const paymentModeId = paymentModeMap.get(paymentModeKey);

            if (!categoryId) {
                console.warn("Category not found for expense:", exp);
                continue;
            }
            if (subcategoryKey && !subcategoryId) {
                console.warn("Subcategory not found for expense:", exp);
                continue;
            }
            if (!paymentModeId) {
                console.warn("Payment mode not found for expense:", exp);
                continue;
            }

            await createExpense(
                exp.date,
                categoryId,
                subcategoryId, // Will be null for categories without subcategories (e.g., 'other')
                exp.amount,
                paymentModeId,
                exp.description
            );
            console.log("Inserted expense for:", exp.date, exp.description);
        } catch (error) {
            console.error("Failed to insert expense:", exp, error);
        }
    }

    

    await AsyncStorage.setItem('db_seeded', 'true');
    console.log('Database seeded successfully!');

}