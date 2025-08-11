<DOCUMENT filename="index.tsx">
import React, { useState, useEffect } from "react";
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
import { BarCodeScanner } from 'expo-barcode-scanner';
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
import { prepareTransaction, toWei, fromWei, estimateGas, getGasPrice } from "thirdweb";

export default function TransferScreen() {
  const colorScheme = useColorScheme();
  const activeAccount = useActiveAccount();
  const activeWallet = useActiveWallet();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [estFee, setEstFee] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const { disconnect } = useDisconnect();

  const { data: balance, refetch: refetchBalance } = useWalletBalance({
    client: getClient(),
    address: activeAccount?.address,
    chain: chain,
  }, {
    refetchInterval: 5000, // Increased to 5 seconds for better performance
  });

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const isValidAmount = (amount: string) => {
    return /^\d*\.?\d*$/.test(amount) && Number(amount) > 0;
  };

  const hasSufficientBalance = () => {
    if (!balance || !amount) return false;
    try {
      return toWei(amount) <= balance.value;
    } catch {
      return false;
    }
  };

  const handleMax = () => {
    if (balance) {
      setAmount(balance.displayValue);
    }
  };

  const handlePasteAddress = async () => {
    const text = await Clipboard.getStringAsync();
    if (isValidAddress(text)) {
      setToAddress(text);
    } else {
      Alert.alert('Invalid Address', 'The clipboard does not contain a valid Ethereum address.');
    }
  };

  const handleScanAddress = () => {
    if (hasPermission === null) {
      Alert.alert('Permission Pending', 'Requesting camera permission...');
      return;
    }
    if (hasPermission === false) {
      Alert.alert('No Camera Access', 'Please grant camera permission in settings to use QR scanner.');
      return;
    }
    setShowScanner(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setShowScanner(false);
    if (isValidAddress(data)) {
      setToAddress(data);
    } else {
      Alert.alert('Invalid QR Code', 'The scanned QR code does not contain a valid Ethereum address.');
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

    if (!hasSufficientBalance()) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    try {
      const transaction = prepareTransaction({
        to: toAddress,
        chain: chain,
        client: getClient(),
        value: toWei(amount),
      });

      const gasPrice = await getGasPrice({ client: getClient(), chain });
      const gas = await estimateGas(transaction);
      const maxFee = gas * gasPrice;
      setEstFee(fromWei(maxFee.toString(), 18)); // Assuming 18 decimals for display
      setShowConfirm(true);
    } catch (error) {
      Alert.alert('Estimation Failed', (error as Error).message || 'Unable to estimate transaction fee');
    }
  };

  const confirmTransfer = () => {
    setShowConfirm(false);
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
        setEstFee(null);
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
              <View style={[
                styles.addressInputContainer,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.border,
                },
              ]}>
                <TextInput
                  style={[
                    styles.input,
                    { color: colors.text, flex: 1 },
                  ]}
                  placeholder="0x..."
                  placeholderTextColor={colors.tabIconDefault}
                  value={toAddress}
                  onChangeText={setToAddress}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity onPress={handlePasteAddress} style={styles.iconButton}>
                  <Ionicons name="clipboard-outline" size={20} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleScanAddress} style={styles.iconButton}>
                  <Ionicons name="qr-code-outline" size={20} color={colors.text} />
                </TouchableOpacity>
              </View>
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
                    !hasSufficientBalance() ||
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

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirm(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowConfirm(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <TouchableOpacity activeOpacity={1}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Confirm Transfer</ThemedText>
                <TouchableOpacity onPress={() => setShowConfirm(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.confirmDetails}>
                <View style={styles.confirmRow}>
                  <ThemedText style={styles.confirmLabel}>To:</ThemedText>
                  <ThemedText style={styles.confirmValue}>{toAddress.slice(0, 6)}...{toAddress.slice(-4)}</ThemedText>
                </View>
                <View style={styles.confirmRow}>
                  <ThemedText style={styles.confirmLabel}>Amount:</ThemedText>
                  <ThemedText style={styles.confirmValue}>{amount} MON</ThemedText>
                </View>
                <View style={styles.confirmRow}>
                  <ThemedText style={styles.confirmLabel}>Est. Fee:</ThemedText>
                  <ThemedText style={styles.confirmValue}>{estFee ? `${estFee} MON` : 'Calculating...'}</ThemedText>
                </View>
              </View>
              
              <ThemedButton
                title="Confirm"
                onPress={confirmTransfer}
                disabled={!estFee || isPending}
                loading={isPending}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* QR Scanner Modal */}
      <Modal
        visible={showScanner}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={showScanner ? handleBarCodeScanned : undefined}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity 
            style={styles.closeScannerButton}
            onPress={() => setShowScanner(false)}
          >
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // ... (existing styles remain the same)
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconButton: {
    padding: 8,
  },
  confirmDetails: {
    marginBottom: 24,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  confirmLabel: {
    fontSize: 16,
    opacity: 0.7,
  },
  confirmValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  closeScannerButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  // Add any other style adjustments as needed
});
</DOCUMENT>
