import React from 'react'
import NextLink from 'next/link';

import { Box, Button, Flex, Link, Text } from '@chakra-ui/core';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface NavBarProps {

}

export const NavBar: React.FC<NavBarProps> = ({ }) => {
  const [{ fetching: logoutFeching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  let body = null;

  // data is loading
  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href='/register' >
          <Link fontWeight='bold' color='white' mr={4}>Register</Link>
        </NextLink >

        <NextLink href='/login'>
          <Link fontWeight='bold' color='white' >Login</Link>
        </NextLink>
      </>
    )
    // user is logged in
  } else {
    body = (
      <Flex alignItems='center'>
        <Text fontSize={18} color='white' fontWeight='bold'>{data.me.username}</Text>
        <Button
          onClick={() => logout()}
          isLoading={logoutFeching}
          bg='white'
          color='black'
          padding={1}
          variant='link'
          ml={4}
        >
          Logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex bg='tomato' p={4} >
      <Box ml={'auto'}>
        {body}
      </Box>
    </Flex>
  );
}