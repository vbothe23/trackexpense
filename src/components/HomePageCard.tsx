import { text } from "@nozbe/watermelondb/decorators";
import { pad } from "crypto-js";
import { View } from "react-native"
import { Text } from "react-native-paper"
import { ElevationLevels } from "react-native-paper/lib/typescript/types";

type HomePageCardProps = {
    category: string;
    price: number;
};

const HomePageCard = ({ category, price }: HomePageCardProps) => {
    return (
        <View style={styles.card}>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.price}>INR: {price}</Text>
        </View>
    )
}

const styles = {
    card: {
        backgroundColor: '#fff',
        padding: 13,
        margin: 3,
        borderRadius: 8,
        elevation: 2, // shadow on Android
        // shadowColor: '#000', // shadow on iOS
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        width: "30%",
        alignItems: 'center',
        justifyContent: 'center', 

    },
    category: {
        fontWeight: 'bold',
        marginBottom: 4,
        fonntSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    price: {
        fontSize: 16,
        color: 'green',
        textAlign: 'center',
    },
}

export default HomePageCard;