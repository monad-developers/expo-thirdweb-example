import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThirdwebProvider } from "thirdweb/react";

import { useColorScheme } from "@/hooks/useColorScheme";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import { Colors } from "../constants/Colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	const thirdwebClientId = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID;
	
	const isDevelopmentMode = __DEV__;
	
	const missingVars = [];
	const requiredVars = {
		'EXPO_PUBLIC_THIRDWEB_CLIENT_ID': thirdwebClientId,
	};
	
	const optionalVars = {};
	
	for (const [key, value] of Object.entries(requiredVars)) {
		if (!value || value === `your_${key.toLowerCase().split('_').slice(-1)[0]}`) {
			missingVars.push({ key, required: true });
		}
	}
	
	for (const [key, value] of Object.entries(optionalVars)) {
		if (!value || value === `your_${key.toLowerCase().split('_').slice(-1)[0]}`) {
			missingVars.push({ key, required: false });
		}
	}
	
	const hasRequiredVars = missingVars.filter(v => v.required).length === 0;
	const hasAllVars = missingVars.length === 0;
	
	const isValidConfig = isDevelopmentMode ? hasRequiredVars : hasAllVars;

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	if (!isValidConfig) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>⚠️ Configuration Error</Text>
				<Text style={styles.errorText}>
					{isDevelopmentMode 
						? 'Missing required environment variables:'
						: 'Please configure all environment variables:'}
				</Text>
				
				{missingVars.filter(v => v.required).length > 0 && (
					<>
						<Text style={styles.sectionTitle}>Required Variables:</Text>
						{missingVars.filter(v => v.required).map((v, index) => (
							<Text key={index} style={styles.configText}>{v.key}</Text>
						))}
					</>
				)}
				
				{missingVars.filter(v => !v.required).length > 0 && (
					<>
						<Text style={styles.sectionTitle}>
							{isDevelopmentMode ? 'Optional Variables (can be set later):' : 'Additional Variables:'}
						</Text>
						{missingVars.filter(v => !v.required).map((v, index) => (
							<Text key={index} style={[styles.configText, styles.optionalVar]}>
								{v.key}
							</Text>
						))}
					</>
				)}
				
				<Text style={styles.helpText}>
					Please set all environment variables in the .env file.
				</Text>
			</View>
		);
	}

	// Import client only after we've confirmed env vars are valid
	require("@/constants/thirdweb");

	return (
		<ThirdwebProvider>
			<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
				<StatusBar
					backgroundColor={Colors.dark.background}
					barStyle="light-content"
				/>
				<Stack>
					<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
					<Stack.Screen name="+not-found" />
				</Stack>
			</ThemeProvider>
		</ThirdwebProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
		color: '#ff6b6b',
	},
	errorText: {
		fontSize: 16,
		textAlign: 'center',
		marginBottom: 20,
		color: '#333',
		lineHeight: 24,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 10,
		marginBottom: 10,
		color: '#555',
	},
	configText: {
		fontSize: 14,
		fontFamily: 'monospace',
		backgroundColor: '#e9e9e9',
		padding: 8,
		marginVertical: 4,
		borderRadius: 4,
		color: '#666',
	},
	optionalVar: {
		backgroundColor: '#f0f0f0',
		color: '#999',
	},
	helpText: {
		fontSize: 14,
		textAlign: 'center',
		marginTop: 20,
		color: '#666',
		fontStyle: 'italic',
	},
});
