import { Flex, IconButton } from '@chakra-ui/core';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment;
}


export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>();
  const [, vote] = useVoteMutation();

  async function handleDoot(doot: number, loading: 'updoot-loading' | 'downdoot-loading' | 'not-loading') {
    setLoadingState(loading)
    await vote({
      postId: post.id,
      value: doot,
    });
    setLoadingState('not-loading')
  }
  return (
    <Flex flexDirection='column' alignItems='center' mr='10px'>
      <IconButton
        onClick={() => handleDoot(1, 'updoot-loading')}
        aria-label="updoot post"
        icon="chevron-up"
        isLoading={loadingState === 'updoot-loading'}
      />
      {post.points}
      <IconButton
        onClick={() => handleDoot(-1, 'downdoot-loading')}
        aria-label="downdoot post"
        icon="chevron-down"
        isLoading={loadingState === 'downdoot-loading'}
      />
    </Flex>
  );
}