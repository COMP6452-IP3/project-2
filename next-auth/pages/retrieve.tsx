import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '../components/layout';
import AccessDenied from '../components/access-denied';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Link,
} from '@chakra-ui/react';
import { makeStorageClient } from './api/web3';
import { useWeb3 } from '@3rdweb/hooks';
import { BigNumber, ethers } from 'ethers';
import abi from '../contracts/Licensing.json';

declare global {
    interface Window {
        ethereum: any;
    }
}

const Retrieve = () => {
    const { data: session, status } = useSession();
    const { connectWallet, address, error } = useWeb3();
    const [cid, setCid] = useState<string>();
    const [validCid, setValidCid] = useState<boolean>(true);
    const [paid, setPaid] = useState<boolean>(false);
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

    const logArtworkCount = async () => {
        contract
            .count()
            .then((count: any) => {
                console.log(count.toNumber());
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    // Connect to metamask wallet
    const handleConnect = async () => {
        connectWallet('injected');
    };

    const checkValidCID = async (cid: string) => {
        const client = makeStorageClient();
        client
            .status(cid)
            .then((status: any) => {
                setValidCid(true);
            })
            .catch((err: any) => {
                setValidCid(false);
            });
    };

    const handleSubmit = async () => {
        // check if cid is valid
        checkValidCID(cid as string);
        if (!validCid) {
            return;
        }
        // get royalty cost from contract
        const royaltyCost: BigNumber = await contract.getRoyalty(cid);
        console.log(royaltyCost.toNumber());

        // set override value to royalty cost
        const overrides = {
            // value: royaltyCost, // ethers.utils.parseUnits(royaltyCost, 'wei'),
            value: ethers.utils.parseUnits(royaltyCost.toString(), 'wei'),
        };
        contract
            .payRoyalty(cid, overrides)
            .then((success: boolean) => {
                setPaid(success);
            })
            .catch((err: any) => {
                console.log(err);
            });
        // retrieve artwork from storage if paid
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
                            <br />
                            <Link
                                textColor={'blue.200'}
                                href={`https://ropsten.etherscan.io/tx/${txHash}`}
                                isExternal
                            >
                                View on Etherscan
                            </Link>
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
                        <Heading mb={4}>Pay and retrieve artwork</Heading>
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
                                <HStack mb={2}>
                                    <Input
                                        type={'text'}
                                        placeholder='CID'
                                        onChange={(e) => setCid(e.target.value)}
                                    />
                                    {/* <Button
                                    type='submit'
                                    w={'100%'}
                                    colorScheme='teal'
                                    variant='outline'
                                >
                                    Check if CID is valid
                                </Button> */}
                                </HStack>

                                <Button
                                    type='submit'
                                    w={'100%'}
                                    colorScheme={validCid ? 'teal' : 'red'}
                                    variant='outline'
                                >
                                    Pay Royalties
                                </Button>
                            </FormControl>
                        </form>
                    </Box>
                    <Button onClick={logArtworkCount}>Log Artwork Count</Button>
                </>
            )}
        </Layout>
    );
};

export default Retrieve;
