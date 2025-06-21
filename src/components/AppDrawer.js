import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React from "react";
import { Alert, View } from "react-native";
import ExpenseListScreen from "../screens/ExpenseListScreen";
import { Text } from "react-native-gesture-handler";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
import AppTabs from "./BottomTabs";

const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {

    const handleSync = () => {
        Alert.alert("Data Synced");
    }

    const handleExit = () => {
        Alert.alert("Exiting the app");
    }

    return (
        <DrawerContentScrollView {...props}>
            <View style={{padding: 16}}>
                <Text style={{ fontSize: 18, marginBottom: 16 }}>User: John Doe</Text>
                <Text style={{ marginBottom: 16 }}>Last Sync: 2024-06-18 12:00 PM</Text>
                <DrawerItem label="Sync Now" onPress={handleSync} />
                <DrawerItem label="Exit App" onPress={handleExit} />
            </View>
        </DrawerContentScrollView>
    )

}

const AppDrawer = () => {
    return (
        <Drawer.Navigator initialRouteName="Home"
            screenOptions={{ headerShown: false,}}
            drawerContent={(props => <CustomDrawerContent {...props} />)}
        >
            {/* <Drawer.Screen name="ExpenseList" component={ExpenseListScreen} /> */}
            <Drawer.Screen name="Home" component={AppTabs} />
        </Drawer.Navigator>
    )
}

export default AppDrawer;