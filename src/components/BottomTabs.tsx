import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExpenseListScreen from "../screens/ExpenseListScreen";
import Summary from "./Summary";


const Tab = createBottomTabNavigator();

const AppTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{headerShown: false}}
        >
            <Tab.Screen name="ExpenseList" component={ExpenseListScreen} />
            <Tab.Screen name="Summary" component={Summary} />
        </Tab.Navigator>
    )
}

export default AppTabs;