import React from 'react'
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box, Button, Text, Link } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';

import { useRegisterMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

interface registerProps { }

const Register: React.FC<registerProps> = ({ }) => {
  const router = useRouter();
  const [, register] = useRegisterMutation()

  return (
    <Wrapper variant='small'>
      <Text fontSize='4xl' color='tomato'>Welcome to Theddit!</Text>

      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          }

          if (response.data?.register.user) {
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
                name='email'
                placeholder='email'
                label='Email'
              />
            </Box>
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
              Register
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

export default withUrqlClient(createUrqlClient)(Register);
