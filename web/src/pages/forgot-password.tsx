import React, { useState } from 'react'
import NextLink from 'next/link';

import { toErrorMap } from '../utils/toErrorMap';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';

import { Alert, AlertIcon, Button, Link, Text } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useForgotPasswordMutation } from '../generated/graphql';

const forgotPassword: React.FC<{}> = ({ }) => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);

  return (
    <Wrapper variant='small'>
      <Text fontSize='2xl' color='tomato'>Change your password</Text>

      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword({ email: values.email });
          setComplete(true);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='email'
              placeholder='email'
              label='Email'
            />

            {complete &&
              <Alert status="success" mt={2}>
                <AlertIcon />
                Link to change password sent!
              </Alert>
            }

            <Button
              mt={5}
              w='100%'
              type='submit'
              variantColor='orange'
              isLoading={isSubmitting}
              isDisabled={complete}
            >
              Send link to change
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

export default withUrqlClient(createUrqlClient)(forgotPassword);