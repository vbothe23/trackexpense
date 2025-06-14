import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ExpenseListScreen from './src/screens/ExpenseListScreen';
import { PaperProvider, Text } from "react-native-paper";
import { View } from "react-native";
import { enableScreens } from "react-native-screens";
import { seedInitialData } from "./src/db/seedInitialData";

const Stack = createNativeStackNavigator();
enableScreens();

const App: React.FC = () => {

  useEffect(() => {
    seedInitialData();
  }, []);


  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ExpenseList">
          <Stack.Screen name="ExpenseList" component={ExpenseListScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
export default App;
