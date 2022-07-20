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
} from '@chakra-ui/react';
import { makeStorageClient } from './api/examples/web3';

export default function Upload() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const [files, setFiles] = useState();

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
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  const handleFileChange = (e : any) => {
    setFiles(e.target.files);
  }

  // If session exists, display content
  return (
    <Layout>
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
              console.log("stored files");
            }
            console.log('submitted');
          }}
        >
          <FormControl isRequired>
            <FormLabel>File</FormLabel>
            <Input type='file' accept='image/*' onChange={handleFileChange} />
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

const storeFiles = async (files : any) => {
  const client = makeStorageClient();
  const cid = await client.put(files);
  console.log('stored files with cid:', cid);
  return cid;
};
