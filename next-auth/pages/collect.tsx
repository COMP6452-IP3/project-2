import { useState } from 'react';
import Layout from '../components/layout';
import {
    Box,
    Button
} from '@chakra-ui/react';
import { makeStorageClient } from './api/web3';
import { useWeb3 } from '@3rdweb/hooks';
import { BigNumber, ethers } from 'ethers';
import abi from '../contracts/Licensing.json';

const Collect = () => {
    const { connectWallet, address, error } = useWeb3();
    const [collected, setCollected] = useState<boolean>(false);

    // Connect to metamask wallet
    const handleConnect = async () => {
        connectWallet('injected');
    };

    const handleCollect = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress: string = process.env.CONTRACT_ADDRESS as string; // Update this to the address of the contract
        const contract = new ethers.Contract(contractAddress, abi, signer);

        contract
            .withdrawRoyalty()
            .then(() => {
                setCollected(true);
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    return (
        <Layout>
            {!address ? (
                <Button my={4} maxW='500px' w={'100%'} onClick={handleConnect}>
                    Connect to Metamask
                </Button>
            ) : (
                <>
                    <Box
                        my={4}
                        p={4}
                        maxWidth='500px'
                        borderWidth={1}
                        borderRadius={8}
                        boxShadow='lg'
                        textAlign={'center'}
                    >
                        Connected to Metamask {address}
                    </Box>

                    <Button
                        w={'100%'}
                        colorScheme={'teal'}
                        variant='outline'
                        onClick={handleCollect}
                    >
                        Collect Royalties
                    </Button>
                    {collected && (
                        <Box
                            my={4}
                            p={4}
                            maxWidth='500px'
                            borderWidth={1}
                            borderRadius={8}
                            boxShadow='lg'
                            textAlign={'center'}
                            textColor={'green.500'}
                        >
                            Royalties Collected
                        </Box>
                    )}
                </>
            )}
        </Layout>
    );
};

export default Collect;
