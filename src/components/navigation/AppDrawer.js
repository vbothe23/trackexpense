import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React from "react";
import { Alert, ToastAndroid, View } from "react-native";
import { Text } from "react-native-gesture-handler";
import AppTabs from "./BottomTabs";
import { downloadFromGoogleDrive, getAccessToken, getBackupFileId, uploadToGoogleDrive } from "../authentication/authHelper";
import { clearDatabase, exportDataBase, restoreFromBackup } from "../../db/queries/models";

const Drawer = createDrawerNavigator();


const CustomDrawerContent = (props) => {

    const handleSync = () => {
        Alert.alert("Data Synced");
    }

    const handleExit = () => {
        Alert.alert("Exiting the app");
    }

    const onPressUploadToDrive = async () => {
        try {
            ToastAndroid.show("Uploading data to Drive...", ToastAndroid.SHORT);
            const accessToken = await getAccessToken();
            const filePath = await exportDataBase();
            await uploadToGoogleDrive(accessToken, filePath);
        } catch (error) {
            ToastAndroid.show("Error uploading to Drive", ToastAndroid.LONG);
            console.error("Error uploading to Google Drive:", error);
        }
    }

    const onPressRestoreFromDrive = async () => {
        const accessToken = await getAccessToken();
        const fileId = await getBackupFileId(accessToken);
        const filePath = await downloadFromGoogleDrive(accessToken, fileId);
        await restoreFromBackup(filePath);
        ToastAndroid.show("Data restored from Drive", ToastAndroid.SHORT);
    }

    return (
        <DrawerContentScrollView {...props}>
            <View style={{padding: 16}}>
                <Text style={{ fontSize: 18, marginBottom: 16 }}>User: Vishal B</Text>
                <Text style={{ marginBottom: 16 }}>Last Sync: 2025-06-21 08:05 PM</Text>
                {/* <DrawerItem label="Sync Now" onPress={handleSync} />
                <DrawerItem label="Exit App" onPress={handleExit} /> */}
                <DrawerItem label={"Upload data to drive"} onPress={onPressUploadToDrive} />
                <DrawerItem label={"Restore data from drive"} onPress={onPressRestoreFromDrive} />
                <DrawerItem label={"Load from backup file"} onPress={() => {}} />
                <DrawerItem label={"Seed Initial data"} onPress={() => {}} />
                <DrawerItem label={"Clear Database"} onPress={clearDatabase} />
                <DrawerItem label={"Signout"} onPress={() => {}} />
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
            <Drawer.Screen name="Home" component={AppTabs} />
        </Drawer.Navigator>
    )
}

export default AppDrawer;