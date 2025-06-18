// CustomDropdown.js
import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet } from 'react-native';

type DropdownItem = {
  label: string;
  value: any;
};

interface CustomDropdownProps {
  items: DropdownItem[];
  placeholder?: { label: string; value: any };
  onValueChange: (value: any) => void;
  value: any;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ items, placeholder, onValueChange, value }) => {
  return (
    <RNPickerSelect
      onValueChange={onValueChange}
      items={items}
      value={value}
      placeholder={placeholder || { label: 'Select an option...', value: null }}
      style={pickerSelectStyles}
    />
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#f0f0f0',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: '#f0f0f0',
  },
});

export default CustomDropdown;
