import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../constants";

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: "primary" | "outline";
    disabled?: boolean;
}

export default function Button({ title, onPress, variant = "primary", disabled = false }: ButtonProps) {
    const isPrimary = variant === "primary";

    return (
        <TouchableOpacity
            style={[styles.button, isPrimary ? styles.primary : styles.outline, disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.text, isPrimary ? styles.textPrimary : styles.textOutline]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, minWidth: 200, alignItems: "center", marginVertical: 6 },
    primary: { backgroundColor: COLORS.primary },
    outline: { borderWidth: 2, borderColor: COLORS.primary },
    text: { fontSize: 16, fontWeight: "600" },
    textPrimary: { color: "#fff" },
    textOutline: { color: COLORS.primary },
    disabled: { opacity: 0.5 },
});