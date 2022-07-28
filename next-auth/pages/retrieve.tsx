import { useState } from 'react';
import Layout from '../components/layout';
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

const Retrieve = () => {
    const { connectWallet, address, error } = useWeb3();
    const [cid, setCid] = useState<string>('');
    const [paid, setPaid] = useState<boolean>(false);
    const [txHash, setTxHash] = useState<string>();

    // Connect to metamask wallet
    const handleConnect = async () => {
        connectWallet('injected');
    };

    const checkValidCID = async (cid: string) => {
        const client = makeStorageClient();
        return client.status(cid);
    };

    const handleSubmit = async () => {
        // check if cid is valid
        const isValid = await checkValidCID(cid);
        if (!isValid) {
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contractAddress: string = process.env.CONTRACT_ADDRESS as string; // Update this to the address of the contract
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // get royalty cost from contract
        const royaltyCost: BigNumber = await contract.getRoyalty(cid);
        console.log(`Royalty cost: ${royaltyCost}`);

        // set override value to royalty cost
        const overrides = {
            value: ethers.utils.parseUnits(royaltyCost.toString(), 'wei'),
        };
        const status = await contract.payRoyalty(cid, overrides);
        setPaid(status);
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
                                </HStack>

                                <Button
                                    type='submit'
                                    w={'100%'}
                                    colorScheme={'teal'}
                                    variant='outline'
                                >
                                    Pay Royalties
                                </Button>
                            </FormControl>
                        </form>
                    </Box>

                    {paid && (
                        <Box
                            my={4}
                            p={4}
                            maxWidth='500px'
                            borderWidth={1}
                            borderRadius={8}
                            boxShadow='lg'
                            textAlign={'center'}
                        >
                            <Link
                                textColor={'blue.200'}
                                href={`https://ipfs.io/ipfs/${cid}`}
                                isExternal
                            >
                                Download
                            </Link>
                        </Box>
                    )}
                </>
            )}
        </Layout>
    );
};

export default Retrieve;
