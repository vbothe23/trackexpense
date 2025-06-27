import 'react-native-reanimated';
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from "react-native-paper";
import { enableScreens } from "react-native-screens";
import LoginScreen from "./src/components/authentication/LoginScreen";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { configureGoogleSignIn, signOut } from "./src/components/authentication/authHelper";
import AppDrawer from "./src/components/navigation/AppDrawer";
import { seedInitialData } from './src/db/seedInitialData';

const Stack = createNativeStackNavigator();
enableScreens();

const App: React.FC = () => {

  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);
  const [ userInfo, setUserInfo ] = React.useState<any>(null);

  useEffect(() => {

    configureGoogleSignIn();
    const fetchUser = async () => {
      await getCurrentUser();
    };
    fetchUser();
  }, []);

  const handleLoginSuccess = (userInfo: any) => {
    console.log("Login Successful: ", userInfo);
    setUserInfo(userInfo);
    setIsLoggedIn(true);
  }

  const handleLogout = async () => {
    signOut();
    setUserInfo(null);
    setIsLoggedIn(false);
  }

  const resetUserInfo = () => {
    setUserInfo(null);
    setIsLoggedIn(false);
  }

  const getCurrentUser = async () => {
    try {
      const { type, data } = await GoogleSignin.signInSilently();
      console.log("Silent sign-in result: ", type, data);
      console.log("User data: ", GoogleSignin.hasPreviousSignIn());
      if (type === 'success') {
        // downloadFromGoogleDrive();
        setIsLoggedIn(true);
        setUserInfo(data.user);
        seedInitialData();
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
            <Stack.Screen name="Home">
              {props => <AppDrawer {...props} userInfo={userInfo} handleLogout={handleLogout} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} handleLoginSuccess={() => handleLoginSuccess} />}
            </Stack.Screen>
          ) }
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}
export default App;
