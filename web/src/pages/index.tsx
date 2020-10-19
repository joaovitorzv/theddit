import { useState } from 'react';
import NextLink from 'next/link';
import { withUrqlClient } from 'next-urql';

import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

import { Layout } from '../components/Layout';
import { UpdootSection } from '../components/UpdootSection';

import { Button, Stack, Box, Heading, Text, Flex } from '@chakra-ui/core';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 3,
    cursor: null as null | string,
  });
  console.log(variables);
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) {
    return <div><p>you got query failed for some reason</p></div>
  }

  return (
    <Layout>
      <Flex mb={5} justifyContent='space-between' alignItems='center'>
        <Heading>Theddit</Heading>
        <NextLink href='/create-post'>
          <Button bg='tomato'>Create new post?</Button>
        </NextLink>
      </Flex>
      <br />
      {fetching && !data ? (
        <div>
          <p>Loading...</p>
        </div>
      ) : (
          <Stack spacing={8}>
            {data && data.posts.posts.map(post => (
              <Flex flexDirection='row' key={post.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={post} />
                <Box>
                  <Heading fontSize="xl">{post.title}</Heading>
                  <Text size={14} color="#ED8936" fontWeight="bold">
                    <span style={{ color: '#4A5568', marginRight: "5px" }}>u/</span>
                    {post.creator.username}
                  </Text>

                  <Text mt={4}>{post.textSnippet}</Text>
                </Box>
              </Flex>
            ))}
          </Stack>
        )
      }

      {data && data.posts.hasMore &&
        <Flex justifyContent='center'>
          <Button
            onClick={() => setVariables({
              limit: variables.limit,
              cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
            })}
            isLoading={fetching}
            my={8}
            width='40%'
          >
            load more
          </Button>
        </Flex>
      }
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
