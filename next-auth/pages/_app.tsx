import { SessionProvider } from 'next-auth/react';
// import './styles.css';

import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import "regenerator-runtime/runtime";

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
    // Ropsten testnet chainid: 3
    const supportedChainIds = [3];

    const connectors = {
        injected: {},
    };

    return (
        <SessionProvider session={pageProps.session} refetchInterval={0}>
          {/* @ts-ignore */}
            <ThirdwebWeb3Provider
                supportedChainIds={supportedChainIds}
                connectors={connectors}
            >
                <ChakraProvider>
                    <Component {...pageProps} />
                </ChakraProvider>
            </ThirdwebWeb3Provider>
        </SessionProvider>
    );
}
