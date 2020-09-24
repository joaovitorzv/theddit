import React from 'react'
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box, Button, Link, Text } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';

import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Login: React.FC<{}> = ({ }) => {
  const router = useRouter();
  const [, login] = useLoginMutation()

  return (
    <Wrapper variant='small'>
      <Text fontSize='4xl' color='tomato'>Login to Theddit!</Text>

      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          }

          if (response.data?.login.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='usernameOrEmail'
              placeholder='username or email'
              label='Username or Email'
            />
            <Box mt={5}>
              <InputField
                name='password'
                placeholder='password'
                label='Password'
                type='password'
              />
            </Box>

            <Button
              mt={5}
              w='100%'
              type='submit'
              variantColor='orange'
              isLoading={isSubmitting}
            >
              Login
            </Button>

            <NextLink href='/forgot-password'>
              <Link color='tomato'>Forgot password?</Link>
            </NextLink>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(Login);
