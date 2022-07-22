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
} from '@chakra-ui/react';
import { makeStorageClient } from './api/web3';
import { useWeb3 } from '@3rdweb/hooks';
import { ethers } from "ethers";
import contactsAbi from '../contracts/Contacts.json';

declare global {
    interface Window {
        ethereum: any
    }
}

const Upload = () => {
    const { data: session, status } = useSession();
    const [files, setFiles] = useState();
    const { connectWallet, address, error } = useWeb3();

    // const web3 = new Web3(
    //     new Web3.providers.HttpProvider(
    //         `https://ropsten.infura.io/v3/${process.env.INFURA_TOKEN}`
    //     )
    // );

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

    const contractAddress = '0x54d071740f29eaee58401b447740019c6230482e';
    const ABI = contactsAbi;
    const contract = new ethers.Contract(contractAddress, ABI, signer);

    const createContact = async () => {
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
        console.log("creating contact");
        contract.createContact(session.user?.name, 'testPhoneNumber').then((tx: any) => {
            console.log(`hash: ${tx.hash}`);
        }).catch((err: any) => {
            console.log(err);
        });
    };

    
    // Connect to metamask wallet
    const handleConnect = async () => {
        // const accounts = window.ethereum.request({ method: 'eth_requestAccounts' });
        // setAccount(accounts[0]);
        connectWallet('injected');
    };
    
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
    
    const handleFileChange = (e: any) => {
        setFiles(e.target.files);
    };


    // const getData = async () => {
    //     const accounts = await window.ethereum.request({ method: 'eth_accounts'});
    //     console.log(`getdata: ${address}`);
    // };

    // getData();

    // If session exists, display content
    return (
        <Layout>
            {!address ? (
                <Button my={4} maxW='500px' w={'100%'} onClick={handleConnect}>
                    Connect to Metamask
                </Button>
            ) : (
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
            )}
            <Box
                p={8}
                maxWidth='500px'
                borderWidth={1}
                borderRadius={8}
                boxShadow='lg'
            >
                <Heading mb={2}>Upload file to copyright</Heading>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (files) {
                            storeFiles(files);
                            console.log('stored files');
                        }
                        console.log('submitted');
                    }}
                >
                    <FormControl isRequired>
                        <FormLabel>File</FormLabel>
                        <Input
                            type='file'
                            accept='image/*'
                            onChange={handleFileChange}
                        />
                        <Button
                            type='submit'
                            mt={4}
                            w={'100%'}
                            colorScheme='teal'
                            variant='outline'
                        >
                            Upload
                        </Button>
                    </FormControl>
                </form>
            </Box>
            <Button onClick={createContact}>test contract</Button>
        </Layout>
    );
};

const storeFiles = async (files: any) => {
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log('stored files with cid:', cid);
    return cid;
};

// https://ropsten.etherscan.io/address/0x54d071740f29eaee58401b447740019c6230482e
export default Upload;

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

// When rendering client side don't display anything until loading is complete
// if (typeof window !== "undefined" && loading) return null
