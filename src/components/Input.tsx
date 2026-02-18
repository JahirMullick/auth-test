import { useState } from "react";
import { KeyboardTypeOptions, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

export default function Input({ label, placeholder, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize }: InputProps) {
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={[styles.input, secureTextEntry && styles.inputWithToggle]}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry && !passwordVisible}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    placeholderTextColor="#999"
                />
                {secureTextEntry && (
                    <Pressable
                        style={styles.eyeButton}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        hitSlop={8}
                    >
                        <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: "100%", marginVertical: 8 },
    label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" },
    inputWrapper: {
        position: "relative",
        justifyContent: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    inputWithToggle: {
        paddingRight: 48,
    },
    eyeButton: {
        position: "absolute",
        right: 12,
        padding: 4,
    },
    eyeIcon: {
        fontSize: 20,
    },
});