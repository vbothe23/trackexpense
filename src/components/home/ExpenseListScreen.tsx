import React, { useEffect, useState } from "react";
import { Modal, View, ScrollView, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { Button, Card, DataTable, FAB, Text, TextInput } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import ExpenseForm from "./ExpenseForm";
import DateTimePicker from '@react-native-community/datetimepicker';
import { ExpenseModel } from "../../db/model/models";
import { clearDatabase, createExpense, exportDataBase, readExpenses, restoreFromBackup, updateExpense } from "../../db/queries/models";
import { ExpenseType, ExpenseViewModel } from "../../common/types";
import { downloadFromGoogleDrive, getAccessToken, getBackupFileId, uploadToGoogleDrive } from "../authentication/authHelper";
import HomePageCard from "../HomePageCard";
import ExpenseCard from "../ExpenseCard";

type RootStackParamList = {
    ExpenseList: undefined;
    AddExpense: { expense?: ExpenseModel };
    Todo: { todoId: number };
};

type NavigationProp = StackNavigationProp<RootStackParamList, "ExpenseList">;

interface Props {
    navigation: NavigationProp;
}

const ExpenseListScreen: React.FC<{ navigation: StackNavigationProp<any> }> = ({ navigation }) => {
    const [expenses, setExpenses] = useState<ExpenseViewModel[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [selectedExpense, setSelectedExpense] = useState<ExpenseViewModel | null>(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totals, setTotals] = useState({});
    const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
    const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);


    useEffect(() => {
        getExpenses();
        setDefaultDateFilter();
    }, []);

    useEffect(() => {
    if (!expenses || expenses.length === 0) return;

    const newTotals = expenses.reduce((acc, expense) => {
        const category = expense.category?.displayName || "Unknown Category";
        const amount = expense.amount || 0;

        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {});
    setTotals(newTotals);
}, [expenses]);

const setDefaultDateFilter = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setFilterStartDate(firstDayOfMonth);
    setFilterEndDate(lastDayOfMonth);
}

    const handleSave = (newExpense: ExpenseType) => {

        console.log(JSON.stringify(newExpense));

        if (newExpense.id) {
            console.log("Updating");
            updateExpense(newExpense.id, 
                {
                    date: newExpense.date,      
                    categoryId: newExpense.category as string,
                    subcategoryId: newExpense.subcategory as string,
                    amount: newExpense.amount,
                    paymentModeId: newExpense.paymentMode as string,
                    notes: newExpense.notes,
                }
            )
            .then(exp => Alert.alert("Expense updated successfully!"))
            .catch(err => Alert.alert("Error updating expense", err.message));
        } else {
            console.log("Creating");
            createExpense(
                newExpense.date, 
                newExpense.category as string, 
                newExpense.subcategory as string, 
                newExpense.amount, 
                newExpense.paymentMode as string, 
                newExpense.notes
            )
            .then(exp => Alert.alert("New expense added successfully!"))
            .catch(err => Alert.alert("Error updating expense", err.message));
        }
        setModalVisible(false);
        getExpenses();
    }

    const handleDelete = (expenseId: string) => {
        setExpenses(expenses.filter(exp => exp.id !== expenseId));
        setModalVisible(false);
        Alert.alert("Expense deleted successfully!");
    }

const getExpenses = () => {
  readExpenses()
    .then(async expenseModels => {
      // Fetch all relations in parallel for each expense
      const expensesWithRelations = await Promise.all(
        expenseModels.map(async e => {
          // @ts-ignore
          const category = await e.category.fetch();
          // @ts-ignore
          const subcategory = await e.subcategory.fetch();
          // @ts-ignore
          const paymentMode = await e.paymentMode.fetch();
          return {
            id: e.id,
            date: e.date,
            amount: e.amount,
            notes: e.notes,
            category: category,
            subcategory: subcategory,
            paymentMode: paymentMode,
            // categoryId: category?.id,
            // subcategoryId: subcategory?.id,
            // paymentModeId: paymentMode?.id,
            // categoryName: category?.displayName || '',
            // subcategoryName: subcategory?.displayName || '',
            // paymentModeName: paymentMode?.displayName || '',
          };
        })
      );
      setExpenses(expensesWithRelations);
    })
    .catch(error => console.error('Error fetching expenses:', error));
};

function formatINR(amount: number): string {
  if (isNaN(amount)) return '';
  return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const onSyncPress = async () => {
    try {
        console.log("Syncing data with Google Drive...");
        
        const accessToken = await getAccessToken();
        const filePath = await exportDataBase();
        console.log("Exported database to:", filePath);
        await uploadToGoogleDrive(accessToken, filePath);

    } catch (error) {
        console.error("Error syncing data:", error);
    }
}

const onRestorePress = async () => {
    const accessToken = await getAccessToken();
    const fileID = await getBackupFileId(accessToken);
    const filePath = await downloadFromGoogleDrive(accessToken, fileID);
    await restoreFromBackup(filePath);
};

const calculation = () => {
    expenses.filter(expense => expense.category?.displayName === "Necessities")
    .reduce((total, expense) => total + expense.amount, 0);
}

const onDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

const categories = [
    "Necessities",
    "Savings & Investments",
    "Education",
    "Enjoyment",
    "Other"
];

    return (
        <View style={styles.container}>

            <View 
            
            style={{ 
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'stretch',
            }}
            >
                

                {/* {categories.map(category => (
                    <HomePageCard 
                        key={category}
                        category={category} 
                        price={totals[category] || 0} 
                        onPress={() => {
                            setSelectedExpense(null);
                            setModalVisible(true);
                        }}
                    />
                ))} */}
            </View>

            {/* <View>
                <DateTimePicker
          value={filterStartDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
        <DateTimePicker
          value={filterEndDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
            </View> */}

            <View>
                <Text style={{}}>Start Date:</Text>
            <TouchableOpacity
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <TextInput
          style={{}}
          value={filterStartDate?.toDateString()}
          editable={false}
        />
      </TouchableOpacity>
      {filterStartDate && (
        <DateTimePicker
          value={filterStartDate}
          mode="date"
          display="default"
          onChange={() => {}}
        />
      )}
            </View>
             <View>
                <Text style={{}}>End Date:</Text>
            <TouchableOpacity
        onPress={() => {}}
        activeOpacity={0.8}
      >
        <TextInput
          style={{}}
          value={filterEndDate?.toDateString()}
          editable={false}
        />
      </TouchableOpacity>
      {filterStartDate && (
        <DateTimePicker
          value={filterStartDate}
          mode="date"
          display="default"
          onChange={() => {}}
        />
      )}
            </View>

            <ScrollView>
                <View>
                {expenses.map(expense => (
                    <ExpenseCard 
                    key={expense.id}
                    category={expense.category?.displayName || "Unknown Category"}
                    subCategory={expense.subcategory?.displayName || "Unknown Subcategory"}
                    price={expense.amount}
                    date={expense.date}
                />
                ))}
            </View>
            </ScrollView>
            
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => {
                    setSelectedExpense(null);
                    setModalVisible(true);
                }}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: '90%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                        <ExpenseForm
                            initialValues={selectedExpense ? selectedExpense : null}
                            onSave={handleSave}
                            onCancel={() => setModalVisible(false)}
                            onDelete={handleDelete}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    column: {
        minWidth: 120, // Adjust this value as needed for dynamic width
    },
    text: {
        color: "#333", // Dark grey color
    },
    fab: {
        position: "absolute",
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#6200ee",
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000", // Black color for header text
    },
    headerCell: {
        backgroundColor: "#f0f0f0", // Light grey background for header cells
        padding: 8, // Add padding for better spacing
    },
    cellText: {
        fontSize: 14,
        color: "#333", // Dark grey color for cell text
    },
    cell: {
        padding: 8, // Add padding for better spacing
        backgroundColor: "#fff", // Optional: white background for cells
    }
});

export default ExpenseListScreen;


