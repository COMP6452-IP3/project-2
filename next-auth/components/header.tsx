import { ReactNode } from 'react';
import NextLink from 'next/link';
import {
    Box,
    Flex,
    HStack,
    Link,
    useColorModeValue,
} from '@chakra-ui/react';

interface NavLinkProps {
    href: string;
    children: ReactNode;
}

const NavLink = (props: NavLinkProps) => (
    <NextLink href={props.href} passHref>
        <Link
            px={2}
            py={1}
            rounded={'md'}
            _hover={{
                textDecoration: 'none',
                bg: useColorModeValue('gray.200', 'gray.700'),
            }}
        >
            {props.children}
        </Link>
    </NextLink>
);

const Links = [
    ['Home', '/'],
    ['Upload', '/upload'],
    ['Authorize', '/authorize'],
    ['Retrieve', '/retrieve'],
    ['Collect', '/collect'],
];

export default function Header() {
    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex
                    h={16}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                >
                    <HStack spacing={8} alignItems={'center'}>
                        <HStack as={'nav'} spacing={4} display={'flex'}>
                            {Links.map((link) => (
                                <NavLink href={link[1]} key={link[0]}>
                                    {link[0]}
                                </NavLink>
                            ))}
                        </HStack>
                    </HStack>
                </Flex>
            </Box>
        </>
    );
}
