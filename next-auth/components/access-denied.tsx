import { signIn } from "next-auth/react"
import { Text, Heading } from "@chakra-ui/react"

export default function AccessDenied() {
  return (
    <>
      <Heading>Access Denied</Heading>
      <Text>
        <a
          href="/api/auth/signin"
          onClick={(e) => {
            e.preventDefault()
            signIn()
          }}
        >
          You must be signed in to view this page.
        </a>
      </Text>
    </>
  )
}
