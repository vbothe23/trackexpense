import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { configureGoogleSignIn } from "./authHelper";


type LoginScreenProps = {
    navigation: StackNavigationProp<any>;
    handleLoginSuccess: (userInfo: any) => void;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, handleLoginSuccess }) => {

    configureGoogleSignIn();

    const signIn = async () => {
    try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        console.log("Login Successful: , ", userInfo);
        // downloadFromGoogleDrive();
        handleLoginSuccess(userInfo);
    } catch (error) {
        Alert.alert("Login Failed");
        console.error("Login Error: ", error);
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