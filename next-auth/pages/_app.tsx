// @ts-nocheck
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import 'regenerator-runtime/runtime';

export default function App({ Component, pageProps }: AppProps) {
    // Ropsten testnet chainid: 3
    const supportedChainIds = [3];

    const connectors = {
        injected: {},
    };

    return (
        <ThirdwebWeb3Provider
            supportedChainIds={supportedChainIds}
            connectors={connectors}
        >
            <ChakraProvider>
                <Component {...pageProps} />
            </ChakraProvider>
        </ThirdwebWeb3Provider>
    );
}
