import React, { useEffect } from 'react';
import { FormControl, FormLabel, Textarea, Button, Input, Text } from '@chakra-ui/core';
import { Wrapper } from '../components/Wrapper';
import { NavBar } from '../components/NavBar';
import { Formik, Form } from 'formik';
import { InputField } from '../components/InputField';
import { useCreatePostMutation, useMeQuery } from '../generated/graphql';

import { useRouter } from 'next/router';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useIsAuth } from '../utils/useIsAuth';

const CreatePost: React.FC<{}> = ({ }) => {
  const router = useRouter();
  useIsAuth();
  const [, createPost] = useCreatePostMutation();

  return (
    <>
      <NavBar />
      <Wrapper variant='small'>

        <Formik
          initialValues={{ title: '', text: '' }}
          onSubmit={async (values, { setErrors }) => {
            console.log(values);
            const { error } = await createPost({ input: values });
            if (!error) {
              router.push('/');
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormControl>
                <Text fontSize={22} color="tomato" >Create new post</Text>

                <InputField label="title" name="title" placeholder="Give a title to your post" />
                <InputField textarea label="content" name="text" type="text" id="text" placeholder="Share your thoughts with the world..." />
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  variantColor="green"
                  mt="2"
                  width="100%"
                >Create post</Button>
              </FormControl>
            </Form>
          )}
        </Formik>

      </Wrapper>
    </>
  );
}

export default withUrqlClient(createUrqlClient)(CreatePost);
