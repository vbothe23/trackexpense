import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExpenseListScreen from "../home/ExpenseListScreen";
import Summary from "../summary/Summary";
import { Icon } from "react-native-paper";


const Tab = createBottomTabNavigator();

const AppTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{headerShown: false}}
        >
            <Tab.Screen name="ExpenseList" component={ExpenseListScreen} 
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Summary" component={Summary} 
                options={{
                    tabBarLabel: "Summary",
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="chart-bar" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default AppTabs;