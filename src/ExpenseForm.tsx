import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownComponent from './components/DropdownComponent';
import { CategoryModel, PaymentModeModel, SubcategoryModel } from './db/model/models';
import { readCategories, readPaymentModes, readSubcategories } from './db/queries/models';
import { ExpenseType, ExpenseViewModel } from './types';

type ExpenseFormProps = {
  initialValues?: ExpenseViewModel | null;
  onSave: (expense: ExpenseType) => void;
  onCancel?: () => void;
  onDelete?: (id: string) => void;
};

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialValues, onSave, onCancel, onDelete }) => {

  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryModel[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentModeModel[]>([]);

  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [paymentModeId, setPaymentModeId] = useState<string>('');

  const [amount, setAmount] = useState(0.0);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    readCategories()
    .then(data => {
      setCategories(data)
    })
    .catch(error => console.error('Error fetching categories:', error));

    readPaymentModes()
    .then(data => setPaymentModes(data))
    .catch(error => console.error('Error fetching payment modes:', error));
  }, []);

  useEffect(() => {
    console.log('Category ID changed', categoryId);
    readSubcategories(categoryId)
    .then(data => {
      console.log('Subcategories for categoryId:', categoryId);
      setSubcategories(data)
    })
    .catch(error => console.error('Error fetching subcategories:', error));
  }, [categoryId]);

  useEffect(() => {    
    if (initialValues) {
      setCategoryId(initialValues.category?.id);
      setSubcategoryId(initialValues.subcategory?.id);
      setPaymentModeId(initialValues.paymentMode?.id);
      console.log("Initial Values Loaded");
      console.log(initialValues.category?.id, initialValues.subcategory?.id, initialValues.paymentMode?.id);
      setAmount(initialValues.amount || 0.0);
      setNotes(initialValues.notes || '');
      setSelectedDate(new Date(initialValues.date || new Date()));
    } else {
      console.log("Not found initial Values");
      setCategoryId('');
      setSubcategoryId('');
      setPaymentModeId('');
      setAmount(0.0);
      setNotes('');
      setSelectedDate(new Date());
    }
  }, [initialValues])

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (!categoryId || !subcategoryId || !amount || !paymentModeId) {
      Alert.alert('Please fill in all fields.');
      return;
    }
    onSave({
      id: initialValues?.id,
      date: selectedDate.toISOString().split('T')[0],
      category: categoryId,
      subcategory: subcategoryId,
      paymentMode: paymentModeId,
      amount: amount || 0,
      notes: notes || '',
    })
  };

  const handleDelete = () => {
    if (initialValues?.id && onDelete) {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this expense?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              onDelete(initialValues!.id!);
            }
          }
        ]
      )
    }
  }

  return (
    <View>
      <Text style={styles.label}>Date:</Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        activeOpacity={0.8}
      >
        <TextInput
          style={styles.input}
          value={selectedDate.toDateString()}
          editable={false}
        />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      <Text style={styles.label}>Category:</Text>
      <DropDownComponent
        data = {categories.map(cat => ({label: cat.displayName, value: cat.id }))}
        onValueChange = {value => setCategoryId(value)}
        value={categoryId}
       />

      <Text style={styles.label}>Subcategory:</Text>
      <DropDownComponent
        data = {subcategories.map(sub => ({label: sub.displayName, value: sub.id}))}
        onValueChange={(value) => setSubcategoryId(value)}
        value={subcategoryId}
      />

      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount.toString()}
        onChangeText={(value) => setAmount(parseFloat(value.toString()) || 0)}
      />

      <Text style={styles.label}>Payment Mode:</Text>
      <DropDownComponent
        data = {paymentModes.map(mode => ({label:mode.displayName, value: mode.id}))}
        onValueChange={value => setPaymentModeId(value)}
        value={paymentModeId}
      />
      
      <Text style={styles.label}>Notes:</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={(value) => setNotes(value)}
        multiline={true}
        numberOfLines={2}
      />

      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button
            title="Save"
            onPress={handleSave}
            color="#6200ee"
          />
        </View>
          <View style={[styles.button, styles.deleteButton]}>
            <Button
              title="Delete"
              onPress={handleDelete}
              color="#ff4444"
            />
          </View>
        <View style={styles.button}>
          <Button
            title="Cancel"
            onPress={onCancel}
            color="#ccc"
          />
        </View>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    color: '#333',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  button: { flex: 1, marginHorizontal: 5 },
  deleteButton: { backgroundColor: '#ff4444' },
});

const pickerSelectStyles = {
  inputIOS: {
    color: '#333',
    padding: 10,
  },
  inputAndroid: {
    color: '#333',
    padding: 10,
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
};

export default ExpenseForm;