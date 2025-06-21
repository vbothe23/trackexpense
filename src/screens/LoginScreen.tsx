import React, { useEffect, useState } from "react";
import { Modal, View, ScrollView, StyleSheet, Button, Alert } from "react-native";
import { DataTable, FAB, Text } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import ExpenseForm from "../ExpenseForm";
import { ExpenseModel } from "../db/model/models";
// import { Expense } from "../components/Expense";
import { CategoryModel, PaymentModeModel } from "../db/model/models";
import CategoryForm from "./CategoryForm";
import { createExpense, readCategories, readExpenses, updateExpense } from "../db/queries/models";
import { date } from "@nozbe/watermelondb/decorators";
import { ExpenseType, ExpenseViewModel } from "../types";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { downloadFromGoogleDrive } from "./authHelper";
import { GOOGLE_WELCIENT_ID } from "../../envWrapper";


type LoginScreenProps = {
    navigation: StackNavigationProp<any>;
    onLoginSuccess: () => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {

    const [ userInfo, setUserInfo ] = useState<any>(null);

    GoogleSignin.configure({
            webClientId: GOOGLE_WELCIENT_ID,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
            offlineAccess: true,
          });

    const signIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        setUserInfo(userInfo);
        console.log("Login Successful: , ", userInfo);
        // downloadFromGoogleDrive();
        onLoginSuccess();
    } catch (error) {
        Alert.alert("Login Failed");
        console.error("Login Error: ", error);
    }
}

const signOut = async () => {
    try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        setUserInfo(null);
        Alert.alert("Signout Successful");
    } catch (error) {
        Alert.alert("Signout Failed");
        console.error("Signout Error: ", error);
    }
}

    return (
        <View style={styles.container}>
            <Button
                title="Login"
                onPress={() => {
                    signIn();
                }}
                color="#6200ee"
            />

            <Button
                title="Signout"
                onPress={() => {
                    signOut();
                }}
                color="#6200ee"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    button: {
        marginTop: 16,
        alignSelf: 'flex-start',
    },
})

export default LoginScreen;