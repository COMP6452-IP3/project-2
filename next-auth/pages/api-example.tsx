import Layout from '../components/layout';
import { Heading, Text } from '@chakra-ui/react';

export default function ApiExamplePage() {
  return (
    <Layout>
      <Heading>API Example</Heading>
      <Text>The examples below show responses from various API endpoints.</Text>
      <Text fontWeight={600}>You must be signed in to see responses.</Text>
      <Heading size='md' mt={2}>
        Session
      </Heading>
      <Text>/api/examples/session</Text>
      <iframe src='/api/examples/session' />
      <Heading size='md' mt={2}>
        JSON Web Token
      </Heading>
      <Text>/api/examples/jwt</Text>
      <iframe src='/api/examples/jwt' />
    </Layout>
  );
}
