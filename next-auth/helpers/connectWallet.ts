export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const address = await window.ethereum.enable(); //connect Metamask
            const obj = {
                connectedStatus: true,
                status: '',
                address: address,
            };
            return obj;
        } catch (error) {
            return {
                connectedStatus: false,
                status: '🦊 Connect to Metamask',
            };
        }
    } else {
        return {
            connectedStatus: false,
            status: '🦊 You must install Metamask into your browser.',
        };
    }
};
