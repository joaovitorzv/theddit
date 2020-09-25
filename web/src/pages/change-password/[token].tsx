import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { Formik, Form } from 'formik';
import { Alert, AlertIcon, Button, Flex, Link, Text } from '@chakra-ui/core';
import { Wrapper } from '../../components/Wrapper';
import { InputField } from '../../components/InputField';
import NextLink from 'next/link';

import { useChangePasswordMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/toErrorMap';
import React, { useState } from 'react';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';

const ChangePassword: NextPage<{ token: string }> = () => {
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();

  const [tokenError, setTokenError] = useState('');

  return (
    <Wrapper variant='small'>
      <Text fontSize='2xl' color='tomato'>Change your password</Text>

      <Formik
        initialValues={{ newPassword: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token: typeof router.query.token === 'string'
              ? router.query.token
              : "",
          });

          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ('token' in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='newPassword'
              placeholder='password'
              label='New password'
              type='password'
            />

            {tokenError &&
              <Alert status="error" mt={2}>
                <AlertIcon />
                {tokenError}

                <NextLink href='/forgot-password'>
                  <Link ml={2} color='tomato'>Get new token</Link>
                </NextLink>
              </Alert>
            }

            <Button
              mt={5}
              w='100%'
              type='submit'
              variantColor='orange'
              isLoading={isSubmitting}
            >
              Change password
          </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
}

export default withUrqlClient(createUrqlClient)(ChangePassword);