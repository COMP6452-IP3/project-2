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
    Input,
    Link,
} from '@chakra-ui/react';
import { makeStorageClient } from './api/web3';
import { useWeb3 } from '@3rdweb/hooks';
import { ethers } from 'ethers';
import abi from '../contracts/Licensing.json';

declare global {
    interface Window {
        ethereum: any;
    }
}

const Upload = () => {
    const { data: session, status } = useSession();
    const { connectWallet, address, error } = useWeb3();
    const [files, setFiles] = useState();
    const [title, setTitle] = useState<string>();
    const [year, setYear] = useState<number>();
    const [uploadedCid, setUploadedCid] = useState<string>();
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

    const addArtwork = async (cid: string) => {
        contract
            .addArtwork(cid, title, year)
            .then((tx: any) => {
                console.log(`hash: ${tx.hash}`);
                setTxHash(tx.hash);
                setUploadedCid(cid);
            })
            .catch((err: any) => {
                console.log(`addArtwork ${err}`);
            })
    };

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

    const handleFileChange = (e: any) => {
        setFiles(e.target.files);
    };

    const storeFiles = async (files: any) => {
        const client = makeStorageClient();
        const cid = await client.put(files);
        console.log('stored files with cid:', cid);
        return cid;
    };

    const handleSubmit = async () => {
        const cid = await storeFiles(files);
        // createContact(cid);
        addArtwork(cid);
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

                    {uploadedCid && (
                        <Box
                        my={4}
                        p={4}
                        maxWidth='500px'
                        borderWidth={1}
                        borderRadius={8}
                        boxShadow='lg'
                        textAlign={'center'}
                    >
                        Artwork ID: {uploadedCid}
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
                        <Heading mb={4}>Upload file for copyright</Heading>
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
                                <FormLabel>File</FormLabel>
                                <Input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleFileChange}
                                    mb={2}
                                />
                                <FormLabel>Title</FormLabel>
                                <Input
                                    type='text'
                                    placeholder='Title'
                                    onChange={(e) => setTitle(e.target.value)}
                                    mb={2}
                                />
                                <FormLabel>Year</FormLabel>
                                <Input
                                    type='number'
                                    placeholder='Year'
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    mb={4}
                                />
                                <Button
                                    type='submit'
                                    w={'100%'}
                                    colorScheme='teal'
                                    variant='outline'
                                >
                                    Upload
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

export default Upload;

// https://ropsten.etherscan.io/address/0x54d071740f29eaee58401b447740019c6230482e

// Fetch content from protected route
// useEffect(() => {
//   const fetchData = async () => {
//     const res = await fetch("/api/examples/upload")
//     const json = await res.json()
//     if (json.content) {
//       setContent(json.content)
//     }
//   }
//   fetchData()
// }, [session])

// const web3 = new Web3(
//     new Web3.providers.HttpProvider(
//         `https://ropsten.infura.io/v3/${process.env.INFURA_TOKEN}`
//     )
// );

// When rendering client side don't display anything until loading is complete
// if (typeof window !== "undefined" && loading) return null

// if (session && account) {
//     // @ts-ignore
//     const contract = new web3.eth.Contract(ABI, contractAddress);
//     contract.methods
//         .createContact(session.user?.name, 'testPhoneNumber')
//         .send({ from: account }, (err: any, res: any) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(res);
//             }
//         });
// }

// window.ethereum.on("chainChanged", () => window.location.reload());

// window.ethereum.on("accountsChanged", (accounts: any) => {
//     if (accounts.length > 0) {
//         console.log(`Using account ${accounts[0]}`);
//     } else {
//         console.log('No accounts connected');
//     }
// });

// window.ethereum.on("message", (msg: any) => {console.log(msg)});

// window.ethereum.on("connect", (info: any) => {
//     console.log(`Connected to ${info}`);
// });

// window.ethereum.on("disconnect", (error: any) => {
//     console.log(`Disconnected: ${error}`);
// });

// const getData = async () => {
//     const accounts = await window.ethereum.request({ method: 'eth_accounts'});
//     console.log(`getdata: ${address}`);
// };

// --------------------------------------------------------------------------------

// const createContact = async (cid: string) => {
//     contract
//         .createContact(session.user?.name, cid)
//         .then((tx: any) => {
//             console.log(`hash: ${tx.hash}`);
//         })
//         .catch((err: any) => {
//             console.log(err);
//         });
// };

// const logContacts = async () => {
//     console.log('getting contacts');
//     await contract
//         .count()
//         .then((count: any) => {
//             console.log(count.toNumber());
//         })
//         .catch((err: any) => {
//             console.log(err);
//         });
// };

// const contractAddress = '0x54d071740f29eaee58401b447740019c6230482e';