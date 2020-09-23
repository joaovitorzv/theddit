import { NavBar } from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { usePostsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <NavBar />
      <h1>Hello world</h1>
      <br />
      {data && data.posts.map(post => (
        <p key={post.id}>{post.title}</p>
      ))}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
