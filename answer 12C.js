class WalletManager {
    constructor() {
        this.walletStore = new Map(); // encrypted keys
    }

    async importWallet(privateKey, password) {
        const wallet = new ethers.Wallet(privateKey);
        const encrypted = encrypt(privateKey, password); // AES or similar
        this.walletStore.set(wallet.address, encrypted);
        return wallet.address;
    }

    async signTransaction(address, transaction, password) {
        const encrypted = this.walletStore.get(address);
        if (!encrypted) throw new Error("Wallet not found");

        const privateKey = decrypt(encrypted, password);
        const wallet = new ethers.Wallet(privateKey);
        return wallet.signTransaction(transaction);
    }

    // avoid exposing keys directly
    exportWallet(address) {
        throw new Error("Exporting private key is not allowed");
    }
}
