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
import Web3 from 'web3';
import contactsAbi from '../contracts/Contacts.json';

declare global {
    interface Window {
        ethereum: any;
    }
    var ethereum: any;
}

interface ConnectInfo {
    chainId: string;
}

export default function Upload() {
    const { data: session, status } = useSession();
    const [files, setFiles] = useState();
    const [connected, setConnected] = useState(false);

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

    // If no session exists, display access denied message
    if (!session || typeof window.ethereum == 'undefined') {
        return (
            <Layout>
                <AccessDenied />
            </Layout>
        );
    }

    const contractAddress = '0xa495a02dc0278f8233299fcb42521cefde32fcbd';
    const ABI = contactsAbi;
    const web3 = new Web3(
        new Web3.providers.HttpProvider(
            `https://ropsten.infura.io/${process.env.INFURA_TOKEN}`
        )
    );

    if (session && connected) {
        // @ts-ignore
        const contract = new web3.eth.Contract(ABI, contractAddress);
        contract.methods
            .createContact(session.user?.name, 'testPhoneNumber')
            .send({from: ethereum.selectedAddress} , (err: any, res: any) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            });
    }

    ethereum.on('disconnect', (error: any) => {
        window.location.reload();
    });

    const handleConnect = async () => {
        ethereum.request({ method: 'eth_requestAccounts' }).then((res: any) => {
            if (!res.error) {
                setConnected(true);
            }
        });
    };

    const handleFileChange = (e: any) => {
        setFiles(e.target.files);
    };

    // If session exists, display content
    return (
        <Layout>
            {!connected ? (
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
                    Connected to Metamask
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
                {/* <Box>
        {content ?? "\u00a0"}\u00a0
      </Box> */}
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
        </Layout>
    );
}

const storeFiles = async (files: any) => {
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log('stored files with cid:', cid);
    return cid;
};
