

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardContent from 'react-native-paper/lib/typescript/components/Card/CardContent';

type ExpenseCardProps = {
    date: string;
    category: string;
    subCategory: string;
    price: number;
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ date, category, subCategory, price }) => {
    return (
        <View style={styles.card}>
            <View style={styles.cardLeftContent}>
                <Text>{date}</Text>
                <Text>{category} - {subCategory}</Text>
            </View>
            <View style={styles.CardContentRight}>
                <Text>{price} /-</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        margin: 2,
        elevation: 1, // shadow on Android
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardLeftContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    CardContentRight: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    }



    // card: {
    //     flexDirection: 'row',
    //     backgroundColor: '#fff',
    //     borderRadius: 8,
    //     elevation: 2,
    //     padding: 16,
    //     margin: 8,
    // },
    // title: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    // },
    // date: {
    //     fontSize: 14,
    //     color: '#888',
    // },
    // price: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    // },
});

export default ExpenseCard;