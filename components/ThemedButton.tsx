import { useThemeColor } from "@/hooks/useThemeColor";
import {
	type PressableProps,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { ThemedText } from "./ThemedText";

export type ThemedButtonProps = {
	lightColor?: string;
	darkColor?: string;
	onPress?: PressableProps["onPress"];
	title: string;
	loading?: boolean;
	loadingTitle?: string;
	variant?: "primary" | "secondary";
	disabled?: boolean;
};

export function ThemedButton(props: ThemedButtonProps) {
	const variant = props.variant ?? "primary";
	const isDisabled = props.loading || props.disabled;
	const bg = useThemeColor(
		{ light: props.lightColor, dark: props.darkColor },
		"tint",
	);
	const textInverted = useThemeColor(
		{ light: props.lightColor, dark: props.darkColor },
		"textInverted",
	);
	const text = useThemeColor(
		{ light: props.lightColor, dark: props.darkColor },
		"text",
	);
	const textColor = variant == "secondary" ? text : textInverted;
	
	// Disabled styles
	const disabledBg = isDisabled ? (variant == "secondary" ? "transparent" : bg + "66") : (variant == "secondary" ? "transparent" : bg);
	const disabledBorderColor = isDisabled ? (variant == "secondary" ? bg + "66" : "transparent") : (variant == "secondary" ? bg : "transparent");
	
	return (
		<TouchableOpacity
			disabled={isDisabled}
			activeOpacity={0.5}
			style={[
				styles.button,
				{
					borderColor: disabledBorderColor,
					borderWidth: variant == "secondary" ? 1 : 0,
					backgroundColor: disabledBg,
					opacity: isDisabled ? 0.6 : 1,
				},
			]}
			onPress={(e) => {
				props.onPress?.(e);
			}}
		>
			{props.loading && (
				<ActivityIndicator animating={props.loading} color={textColor} />
			)}
			<ThemedText type="defaultSemiBold" style={{ color: textColor }}>
				{props.loading ? props.loadingTitle : props.title}
			</ThemedText>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		flex: 1,
		flexDirection: "row",
		gap: 8,
		padding: 12,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
	},
});
