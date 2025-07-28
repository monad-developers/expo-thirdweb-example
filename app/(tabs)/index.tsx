import React, { useState } from "react";
import {
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	Modal,
	Alert,
	Linking,
} from "react-native";
import * as Clipboard from 'expo-clipboard';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import {
	ConnectButton,
	useActiveAccount,
	useActiveWallet,
	useWalletBalance,
	useSendTransaction,
	useDisconnect,
} from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
import { getClient, chain } from "@/constants/thirdweb";
import { Ionicons } from "@expo/vector-icons";
import { prepareTransaction, toWei } from "thirdweb";

export default function TransferScreen() {
	const colorScheme = useColorScheme();
	const activeAccount = useActiveAccount();
	const activeWallet = useActiveWallet();
	const [toAddress, setToAddress] = useState("");
	const [amount, setAmount] = useState("");
	const [showModal, setShowModal] = useState(false);

	const { disconnect } = useDisconnect();

	const { data: balance, refetch: refetchBalance } = useWalletBalance({
		client: getClient(),
		address: activeAccount?.address,
		chain: chain,
	}, {
		refetchInterval: 1000, // 1秒刷新
	});

	const { mutate: sendTransaction, isPending } = useSendTransaction();

	const isValidAddress = (address: string) => {
		return /^0x[a-fA-F0-9]{40}$/.test(address);
	};

	const isValidAmount = (amount: string) => {
		return /^\d*\.?\d*$/.test(amount) && Number(amount) > 0;
	};

	const handleMax = () => {
		if (balance) {
			setAmount(balance.displayValue);
		}
	};

	const handleTransfer = async () => {
		if (!activeAccount) {
			Alert.alert('Error', 'Please connect your wallet first');
			return;
		}
		
		if (!toAddress.trim()) {
			Alert.alert('Error', 'Please enter a recipient address');
			return;
		}
		
		if (!isValidAddress(toAddress)) {
			Alert.alert('Error', 'Please enter a valid Ethereum address');
			return;
		}
		
		if (!amount.trim()) {
			Alert.alert('Error', 'Please enter an amount to transfer');
			return;
		}
		
		if (!isValidAmount(amount)) {
			Alert.alert('Error', 'Please enter a valid amount (must be greater than 0)');
			return;
		}

		const transaction = prepareTransaction({
			to: toAddress,
			chain: chain,
			client: getClient(),
			value: toWei(amount),
		});

		sendTransaction(transaction, {
			onSuccess: (result) => {
				const txHash = result.transactionHash;
				Alert.alert(
					'Transaction Successful!',
					`Transaction Hash: ${txHash}\n\nWould you like to view it on the blockchain explorer?`,
					[
						{ text: 'OK', style: 'default' },
						{
							text: 'View on Explorer',
							onPress: () => {
								const explorerUrl = `https://testnet.monvision.io/tx/${txHash}`;
								Linking.openURL(explorerUrl).catch(() => {
									Alert.alert('Error', 'Unable to open blockchain explorer');
								});
							}
						}
					]
				);
				setToAddress("");
				setAmount("");
				// Refetch balance after successful transaction
				setTimeout(() => {
					refetchBalance();
				}, 2000);
			},
			onError: (error) => {
				Alert.alert('Transaction Failed', error.message || 'Unknown error occurred');
			}
		});
	};


	const handleDisconnect = () => {
		if (activeWallet) {
			disconnect(activeWallet);
		}
	};

	const colors = Colors[colorScheme ?? "light"];


	return (
		<ThemedView style={styles.container}>
			<SafeAreaView style={styles.safeArea}>
				{/* Bar Component */}
				<View style={[styles.bar, { borderBottomColor: colors.border }]}>
					<ThemedText style={styles.title}>Transfer</ThemedText>
					<View style={styles.walletIcon}>
						{!activeAccount ? (
							<View style={styles.connectButtonContainer}>
								<ConnectButton
									client={getClient()}
									wallets={[
										inAppWallet({
											auth: {
												options: ["email"],
											},
										}),
									]}
									connectButton={{
										label: "Connect"
									}}
								/>
							</View>
						) : (
							<TouchableOpacity
								onPress={() => setShowModal(true)}
								style={[styles.accountButton, { backgroundColor: colors.background, borderColor: colors.border }]}
							>
								<View style={styles.accountInfo}>
									<View style={[styles.avatar, { backgroundColor: colors.tint }]}>
										<ThemedText style={styles.avatarText}>
											{activeAccount.address.slice(2, 4).toUpperCase()}
										</ThemedText>
									</View>
									<ThemedText style={styles.addressText}>
										{activeAccount.address.slice(0, 6)}...{activeAccount.address.slice(-4)}
									</ThemedText>
									<Ionicons name="chevron-down" size={16} color={colors.text} />
								</View>
							</TouchableOpacity>
						)}
					</View>
				</View>

				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.content}
				>
					<ScrollView contentContainerStyle={styles.scrollContent}>
						{/* To Address Component (A) */}
						<View style={styles.inputGroup}>
							<View style={styles.labelRow}>
								<ThemedText style={styles.label}>To</ThemedText>
							</View>
							<TextInput
								style={[
									styles.input,
									{
										backgroundColor: colors.inputBackground,
										color: colors.text,
										borderColor: colors.border,
									},
								]}
								placeholder="0x..."
								placeholderTextColor={colors.tabIconDefault}
								value={toAddress}
								onChangeText={setToAddress}
								autoCapitalize="none"
								autoCorrect={false}
							/>
						</View>

						{/* Amount Component (B) */}
						<View style={styles.inputGroup}>
							<View style={styles.labelRow}>
								<ThemedText style={styles.label}>Amount</ThemedText>
								{balance && (
									<ThemedText style={styles.balance}>
										Balance: {balance.displayValue} MON
									</ThemedText>
								)}
							</View>
							<View style={[
								styles.amountInputContainer,
								{
									backgroundColor: colors.inputBackground,
									borderColor: colors.border,
								},
							]}>
								<TextInput
									style={[styles.amountInput, { color: colors.text }]}
									placeholder="0.0"
									placeholderTextColor={colors.tabIconDefault}
									value={amount}
									onChangeText={setAmount}
									keyboardType="numeric"
									autoCapitalize="none"
									autoCorrect={false}
								/>
								<TouchableOpacity onPress={handleMax} style={styles.maxButton}>
									<ThemedText style={[styles.maxText, { color: colors.tint }]}>
										MAX
									</ThemedText>
								</TouchableOpacity>
								<ThemedText style={styles.suffix}>MON</ThemedText>
							</View>
						</View>

						{/* Transfer Button (C) */}
						<View style={styles.buttonContainer}>
							{!activeAccount ? (
								<ConnectButton
									client={getClient()}
									wallets={[
										inAppWallet({
											auth: {
												options: ["email"],
											},
										}),
									]}
									connectButton={{
										label: "Connect Wallet"
									}}
								/>
							) : (
								<ThemedButton
									title={isPending ? "Transferring..." : "Transfer"}
									onPress={handleTransfer}
									loading={isPending}
									disabled={
										!isValidAddress(toAddress) ||
										!isValidAmount(amount) ||
										isPending
									}
								/>
							)}
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>

			{/* Account Modal */}
			<Modal
				visible={showModal}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowModal(false)}
			>
				<TouchableOpacity 
					style={styles.modalOverlay} 
					activeOpacity={1} 
					onPress={() => setShowModal(false)}
				>
					<View style={[styles.modalContent, { backgroundColor: colors.background }]}>
						<TouchableOpacity activeOpacity={1}>
							<View style={styles.modalHeader}>
								<ThemedText style={styles.modalTitle}>Account</ThemedText>
								<TouchableOpacity onPress={() => setShowModal(false)}>
									<Ionicons name="close" size={24} color={colors.text} />
								</TouchableOpacity>
							</View>
							
							{activeAccount && (
								<>
									<View style={styles.accountDetails}>
										<View style={[styles.largeAvatar, { backgroundColor: colors.tint }]}>
											<ThemedText style={styles.largeAvatarText}>
												{activeAccount.address.slice(2, 4).toUpperCase()}
											</ThemedText>
										</View>
										<View style={styles.addressContainer}>
											<ThemedText style={styles.fullAddress}>
												{activeAccount.address.slice(0, 8)}...{activeAccount.address.slice(-8)}
											</ThemedText>
											<TouchableOpacity
												onPress={async () => {
													await Clipboard.setStringAsync(activeAccount.address);
													Alert.alert('Copied', 'Address copied to clipboard');
												}}
												style={styles.copyButton}
											>
												<Ionicons name="copy-outline" size={20} color={colors.text} />
											</TouchableOpacity>
										</View>
										{balance && (
											<ThemedText style={styles.balanceText}>
												{balance.displayValue} MON
											</ThemedText>
										)}
									</View>
									
									<TouchableOpacity
										style={[styles.disconnectButton, { backgroundColor: '#ff4444' }]}
										onPress={() => {
											handleDisconnect();
											setShowModal(false);
										}}
									>
										<ThemedText style={styles.disconnectButtonText}>
											Disconnect
										</ThemedText>
									</TouchableOpacity>
								</>
							)}
						</TouchableOpacity>
					</View>
				</TouchableOpacity>
			</Modal>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	bar: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingTop: 16,
		paddingBottom: 16,
		borderBottomWidth: 1,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
	},
	walletIcon: {
		padding: 0,
	},
	content: {
		flex: 1,
	},
	scrollContent: {
		padding: 20,
		paddingTop: 40,
	},
	inputGroup: {
		marginBottom: 32,
	},
	labelRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
	},
	balance: {
		fontSize: 14,
		opacity: 0.7,
	},
	input: {
		borderWidth: 1,
		borderRadius: 8,
		padding: 16,
		fontSize: 16,
		width: "100%",
	},
	amountInputContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	amountInput: {
		flex: 1,
		fontSize: 16,
		paddingVertical: 4,
	},
	maxButton: {
		paddingHorizontal: 8,
		paddingVertical: 4,
	},
	maxText: {
		fontSize: 14,
		fontWeight: "600",
	},
	suffix: {
		fontSize: 16,
		marginLeft: 8,
		opacity: 0.6,
	},
	buttonContainer: {
		marginTop: 40,
	},
	connectButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
	},
	connectButtonContainer: {
		alignItems: 'flex-end',
	},
	connectButtonText: {
		color: "white",
		fontWeight: "600",
		fontSize: 14,
	},
	accountButton: {
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	accountInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	avatar: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
	avatarText: {
		color: "white",
		fontSize: 10,
		fontWeight: "600",
	},
	addressText: {
		fontSize: 14,
		fontWeight: "500",
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "flex-end",
	},
	modalContent: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 20,
		paddingBottom: 40,
	},
	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: "600",
	},
	accountDetails: {
		alignItems: "center",
		marginBottom: 24,
	},
	largeAvatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	largeAvatarText: {
		color: "white",
		fontSize: 24,
		fontWeight: "600",
	},
	fullAddress: {
		fontSize: 16,
		marginBottom: 0,
		textAlign: "center",
	},
	addressContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		marginBottom: 8,
	},
	copyButton: {
		padding: 6,
		borderRadius: 4,
	},
	balanceText: {
		fontSize: 20,
		fontWeight: "600",
	},
	disconnectButton: {
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	disconnectButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},
});