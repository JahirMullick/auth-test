import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import AuthNavigator from "./AuthNavigator";
import MainNavigator from "./MainNavigator";
import { useAuth } from "../context/AuthContext";
import SplashScreenView from "../screens/SplashScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuth();

    // Hide the native Expo splash immediately so our custom one takes over
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    // Show custom splash screen while checking for existing token
    if (isLoading) {
        return <SplashScreenView />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="Main" component={MainNavigator} />
                ) : (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}