import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { AuthStackParamList } from "../../navigation/types";
import { fakeLogin } from '../../services/authHelper';
import { Formik } from "formik";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = NativeStackScreenProps<AuthStackParamList, "Login">;

interface FormErrors {
    email?: string;
    password?: string;
}

export default function LoginScreen({ navigation }: Props) {
    const [loading, setLoading] = React.useState(false);
    const [loginError, setLoginError] = React.useState<string | null>(null);
    const { signIn } = useAuth();

    return (
        <SafeAreaView style={styles.safeArea}>
        <Formik
            initialValues={{ email: "", password: "" }}
            validate={values => {
                const errors: FormErrors = {};
                if (!values.email) {
                    errors.email = 'Email is required';
                } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                    errors.email = 'Invalid email address';
                }
                if (!values.password) {
                    errors.password = 'Password is required';
                } else if (values.password.length < 4) {
                    errors.password = 'Password must be at least 4 characters';
                }
                return errors;
            }}
            onSubmit={async (values) => {
                setLoading(true);
                setLoginError(null);
                const result = await fakeLogin(values.email, values.password);
                setLoading(false);
                if (result.success === true) {
                    await signIn(result.token);
                } else {
                    setLoginError(result.error);
                }
            }}
        >
            {({ values, setFieldValue, handleSubmit, errors, touched }) => (
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>
                    <View style={styles.form}>
                        {loginError && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{loginError}</Text>
                            </View>
                        )}
                        <Input 
                            label="Email" 
                            placeholder="Enter your email" 
                            value={values.email} 
                            onChangeText={(text) => setFieldValue("email", text)} 
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {touched.email && errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
                        <Input 
                            label="Password" 
                            placeholder="Enter your password" 
                            value={values.password} 
                            onChangeText={(text) => setFieldValue("password", text)} 
                            secureTextEntry 
                        />
                        {touched.password && errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}
                        <Button 
                            title={loading ? "Logging in..." : "Login"} 
                            onPress={() => handleSubmit()} 
                            disabled={loading} 
                        />
                        {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}
                    </View>
                </View>
            )}
        </Formik>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    
    container: { flex: 1, justifyContent: "center", alignItems: "center"},
    content: {
        flex: 1,
        maxHeight: 600,
        width: "100%",
    },
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
    form: { width: "100%", gap: 12, paddingHorizontal: 20 },
    fieldError: { color: "#dc3545", fontSize: 12, marginTop: -8 },
    errorContainer: { 
        backgroundColor: "#f8d7da", 
        borderColor: "#f5c6cb", 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 12, 
        marginBottom: 8 
    },
    errorText: { color: "#721c24", fontSize: 14, textAlign: "center" },
    loader: { marginTop: 16 },
    error: { color: "red", fontSize: 12 },
});