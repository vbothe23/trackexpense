import React, { useState, useEffect } from "react";
import { StyleSheet, View } from 'react-native';
import { Modal, Portal, TextInput, Button, Text } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

type Expense = {
    id? : number;
    date: string;
    category: string;
    subcategory: string;
    amount: number;
    paymentMode: string;
    notes: string;
};

const categories = {
    Necessities: ['Food', 'Rent', 'Housing', 'Health', 'Transport', 'Grooming'],
    'Savings & Investment': ['RD', 'FD', 'Mutual Fund', 'Stocks', 'Gold'],
    Enjoyment: ['Hangout', 'Travel', 'Food'],
    Education: [],
    Contribution: [],
    Other: [],
};

  const paymentModes = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'];

  interface Props {
    visible: boolean;
    onClose: () => void;
    onSave: (expense: Expense) => void;
    initialData?: Expense;
}

const ExpenseForm: React.FC<Props> = ({ visible, onClose, onSave, initialData = {} as Partial<Expense> }) => {
    const [category, setCategory] = useState(initialData.category || '');
    const [subcategory, setSubcategory] = useState(initialData.subcategory || '');
    const [amount, setAmount] = useState(initialData.amount?.toString() || '');
    const [paymentMode, setPaymentMode] = useState(initialData.paymentMode || '');
    const [notes, setNotes] = useState(initialData.notes || '');

    useEffect(() => {
        setSubcategory(initialData.subcategory || '');
    }, [category]);

    const handleSave = () => {
        const newExpense: Expense = {
            id: initialData.id,
            date: new Date().toISOString(),
            category,
            subcategory,
            amount: parseFloat(amount),
            paymentMode: paymentMode,
            notes,
        };
        onSave(newExpense);
        onClose();
    };

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
                <View>
                    <Text>{ initialData.id ? "Edit Expense": "Add Expense" }</Text>
                    <Picker
                        selectedValue={category}
                        onValueChange={(value) => setCategory(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Category" value="" />
                            {Object.keys(categories).map((cat) => (
                                <Picker.Item key={cat} label={cat} value={cat} />
                            ))}
                    </Picker>

                    <Picker
                        selectedValue={subcategory}
                        onValueChange={(value) => setSubcategory(value)}
                        style={styles.picker}
                        enabled={!!category}
                    >
                        <Picker.Item label="Select Subcategory" value="" />
                        {(categories[category as keyof typeof categories] ?? []).map((sub: string) => (
                            <Picker.Item key={sub} label={sub} value={sub} />
                        ))}
                    </Picker>

                    <Picker
                        selectedValue={paymentMode}
                        onValueChange={(value) => setPaymentMode(value)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select Payment Mode" value="" />
                            {paymentModes.map((mode) => (
                                <Picker.Item key={mode} label={mode} value={mode} />
                            ))}
                    </Picker>
                    <TextInput
                        label="Notes"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        style={styles.input}
                    />

                    <View style={styles.buttons}>
                        <Button mode="contained" onPress={handleSave} disabled={!category || !amount}>
                        Save
                        </Button>
                        <Button mode="outlined" onPress={onClose}>
                        Cancel
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    modal: { backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 8 },
    form: { gap: 10 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
    input: { marginVertical: 5 },
    buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
});

export default ExpenseForm;

