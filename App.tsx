import 'react-native-reanimated';
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";
import LoginScreen from "./src/components/authentication/LoginScreen";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { configureGoogleSignIn } from "./src/components/authentication/authHelper";
import AppDrawer from "./src/components/navigation/AppDrawer";
import { seedInitialData } from './src/db/seedInitialData';

const Stack = createNativeStackNavigator();
enableScreens();

const App: React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);

  useEffect(() => {

    configureGoogleSignIn();
    const fetchUser = async () => {
      await getCurrentUser();
    };
    fetchUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { type, data } = await GoogleSignin.signInSilently();
      console.log("Silent sign-in result: ", type, data);
      console.log("User data: ", GoogleSignin.hasPreviousSignIn());
      
      if (type === 'success') {
        // downloadFromGoogleDrive();
        setIsLoggedIn(true);
        // seedInitialData();
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error during silent sign-in: ", error);
      setIsLoggedIn(false);
    }
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>

          { isLoggedIn ? (
            <Stack.Screen name="Home" component={AppDrawer} />
          ) : (
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} onLoginSuccess={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
          ) }
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
export default App;
