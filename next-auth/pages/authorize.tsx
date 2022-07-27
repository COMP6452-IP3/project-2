import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import AccessDenied from '../components/access-denied';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Link,
} from '@chakra-ui/react';
import { useWeb3 } from '@3rdweb/hooks';
import { ethers } from 'ethers';
import abi from '../contracts/Licensing.json';

declare global {
    interface Window {
        ethereum: any;
    }
}

const Authorize = () => {
    const { data: session, status } = useSession();
    const { connectWallet, address, error } = useWeb3();
    const [cid, setCid] = useState<string>();
    const [userAddress, setUserAddress] = useState<string>();
    const [royalty, setRoyalty] = useState<number>(0);
    const [txHash, setTxHash] = useState<string>();

    // If no session exists or metamask not installed, display access denied message
    if (!session || typeof window.ethereum == 'undefined') {
        return (
            <Layout>
                <AccessDenied />
            </Layout>
        );
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contractAddress: string = process.env.CONTRACT_ADDRESS as string; // Update this to the address of the contract
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Connect to metamask wallet
    const handleConnect = async () => {
        connectWallet('injected');
    };

    const handleSubmit = async () => {
        // convert royalty in eth to wei
        const wei = ethers.utils.parseEther(royalty.toString());
        contract
            .grantPermission(cid, userAddress, wei)
            .then((tx: any) => {
                console.log(`hash: ${tx.hash}`);
                setTxHash(tx.hash);
            })
            .catch((err: any) => {
                console.log(`addArtwork ${err}`);
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

                    {txHash && (
                        <Box
                        my={4}
                        p={4}
                        maxWidth='500px'
                        borderWidth={1}
                        borderRadius={8}
                        boxShadow='lg'
                        textAlign={'center'}
                    >
                        Transaction hash: {txHash}
                        <br/>
                        <Link textColor={'blue.200'} href={`https://ropsten.etherscan.io/tx/${txHash}`} isExternal>View on Etherscan</Link>
                    </Box>
                    
                    )}

                    <Box
                        p={8}
                        maxWidth='500px'
                        borderWidth={1}
                        borderRadius={8}
                        boxShadow='lg'
                        textAlign={'center'}
                    >
                        <Heading mb={4}>Set royalty amount for licensees</Heading>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                console.log('submitting files');
                                if (address) {
                                    handleSubmit().then(() => {
                                        console.log('finished submission');
                                    });
                                }
                            }}
                        >
                            <FormControl isRequired>
                                <FormLabel>File ID</FormLabel>
                                <Input
                                    type={'text'}
                                    placeholder='CID'
                                    onChange={(e) => setCid(e.target.value)}
                                    mb={2}
                                />
                                <FormLabel>User Address</FormLabel>
                                <Input
                                    type={'text'}
                                    placeholder='User Address'
                                    onChange={(e) =>
                                        setUserAddress(e.target.value)
                                    }
                                    mb={2}
                                />
                                <FormLabel>Royalty Amount (ETH) </FormLabel>
                                <Input
                                    type={'number'}
                                    placeholder='Royalty Amount'
                                    onChange={(e) =>
                                        setRoyalty(parseInt(e.target.value))
                                    }
                                    mb={4}
                                />
                                <Button
                                    type='submit'
                                    w={'100%'}
                                    colorScheme='teal'
                                    variant='outline'
                                >
                                    Set Royalties
                                </Button>
                            </FormControl>
                        </form>
                    </Box>
                </>
            )}
        </Layout>
    );
};

export default Authorize;