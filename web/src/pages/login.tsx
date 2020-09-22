import React from 'react'
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box, Button, Link, Text } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';

import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';




const Login: React.FC<{}> = ({ }) => {
  const router = useRouter();
  const [, login] = useLoginMutation()

  return (
    <Wrapper variant='small'>
      <Text fontSize='4xl' color='tomato'>Login to Theddit!</Text>

      <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
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
              name='username'
              placeholder='username'
              label='Username'
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

            <NextLink href='/'>
              <Link color='tomato'>Back to home</Link>
            </NextLink>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}

export default Login;
