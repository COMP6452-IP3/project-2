import Header from "./header"
import { Box, VStack } from "@chakra-ui/react"

interface Props {
  children: React.ReactNode
}

const Layout = ({ children }: Props) => {
  return (
    <VStack maxW={'1000px'} mx={'auto'} w={"80%"} >
      <Header />
      <Box>{children}</Box>
    </VStack>
  )
}

export default Layout;
