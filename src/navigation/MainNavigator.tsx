import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import { MainTabParamList } from "./types";

const Stack = createNativeStackNavigator<MainTabParamList>();

export default function MainNavigator() {
    return (
        <Stack.Navigator id="MainStack" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
}
