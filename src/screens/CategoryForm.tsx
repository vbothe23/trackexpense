import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Platform, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
// import { Expense } from './components/Expense';
// import DropDownComponent from './components/DropdownComponent';
import { Dropdown } from 'react-native-element-dropdown';
import { createCategory } from '../db/queries/models';

type CategoryFormProps = {
  onCancel?: () => void;
};



const CategoryForm: React.FC<CategoryFormProps> = ({onCancel}) => {
  const [categoryName, setCategory] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSave = () => {
    createCategory(categoryName, displayName)
    .then( category => {
        Alert.alert('Category created!', `Key: ${category.key}, Display Name: ${category.displayName}`);
    })
    .catch(error => {
        console.error('Error creating category:', error);
        Alert.alert('Error', 'Failed to create category.');
    })
  }

  return (
    <View>
      <Text style={styles.label}>Category:</Text>
      <TextInput
        style={styles.input}
        value={categoryName}
        onChangeText={(value) => setCategory(value)}
      />

      <Text style={styles.label}>Display Name:</Text>
      <TextInput
        style={styles.input}
        value={displayName}
        onChangeText={(value) => setDisplayName(value)}
      />

      <Button
        title="Save Category"
        onPress={() => {
          if (categoryName && displayName) {
            createCategory(categoryName, displayName)
            .then(category => {
                Alert.alert('Category created!', `Key: ${category.key}, Display Name: ${category.displayName}`);
            })
            .catch(error => {
                console.error('Error creating category:', error);
                Alert.alert('Error', 'Failed to create category.');
            })
          } else {
            Alert.alert('Error', 'Please fill in all fields.');
          }
        }}
      />
      <Button
        title="cancel"
        onPress={() => {
            onCancel && onCancel();
        }}
        color="#ff4444"
      />
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

export default CategoryForm;