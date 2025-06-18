import React, { useState } from 'react';
import { View, Text, TextInput, Button, Platform, Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const FormScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const handleSubmit = () => {
    console.log({
      name,
      gender,
      dob: dob.toDateString(),
    });
    Alert.alert(`Submitted:\nName: ${name}\nGender: ${gender}\nDOB: ${dob.toDateString()}`);
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 18 }}>Name:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 20,
        }}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={{ fontSize: 18 }}>Gender:</Text>
      <RNPickerSelect
        onValueChange={(value:string) => setGender(value)}
        items={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ]}
        style={{
          inputIOS: {
            fontSize: 16,
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            color: 'black',
            paddingRight: 30,
            marginBottom: 20,
          },
          inputAndroid: {
            fontSize: 16,
            paddingHorizontal: 10,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            color: 'black',
            paddingRight: 30,
            marginBottom: 20,
          },
        }}
        placeholder={{ label: 'Select gender...', value: null }}
        value={gender}
      />

      <Text style={{ fontSize: 18 }}>Date of Birth:</Text>
      <Button title={dob.toDateString()} onPress={() => setShowDatePicker(true)} />

      <View style={{ marginTop: 30 }}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default FormScreen;
