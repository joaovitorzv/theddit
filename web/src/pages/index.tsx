import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';
import NextLink from 'next/link';
import { Button, Stack, Box, Heading, Text } from '@chakra-ui/core';
import { Layout } from '../components/Layout';

const Index = () => {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,

    }
  });

  return (
    <Layout>
      <NextLink href='/create-post'>
        <Button color='orange'>Create new post?</Button>
      </NextLink>
      <br />

      <Stack spacing={8}>
        {data && data.posts.map(post => (
          <Box key={post.id} p={5} shadow="md" borderWidth="1px">
            <Heading fontSize="xl">{post.title}</Heading>
            <p>{post.creatorId}</p>
            <Text mt={4}>{post.text}</Text>
          </Box>
        ))}
      </Stack>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
