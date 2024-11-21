const GRAPHQL_API_URL = 'http://localhost:3002/graphql';

const fetchGraphQL = async (query, variables) => {
  try {
    const response = await fetch(GRAPHQL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    if (response.ok && !result.errors) {
      return result.data;
    } else {
      throw new Error(result.errors ? result.errors.map(err => err.message).join(", ") : 'Request failed');
    }
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    throw error;
  }
};

export const getBoardPosts = async (page, limit) => {
  const query = `
    query GetBoardPosts($page: Float!, $limit: Float!) {
      getBoardPosts(page: $page, limit: $limit) {
        posts {
          title
          content
          id
          createdAt
        }
        totalCount
      }
    }
  `;

  const variables = { page, limit };
  const data = await fetchGraphQL(query, variables);
  return data.getBoardPosts;
};

export const getBoardPostById = async (id) => {
  const query = `
    query GetBoardPostById($id: String!) {
      getBoardPostById(id: $id) {
        id
        title
        content
        createdAt
      }
    }
  `;

  const variables = { id };
  const data = await fetchGraphQL(query, variables);
  return data.getBoardPostById;
};

export const createBoardPost = async (title, content, password) => {
  const mutation = `
    mutation CreateBoardPost($title: String!, $content: String!, $password: String!) {
      createBoardPost(title: $title, content: $content, password: $password) {
        title
        content
      }
    }
  `;

  const variables = { title, content, password };
  const data = await fetchGraphQL(mutation, variables);
  return data.createBoardPost;
};

export const createCommentToPost = async (postId, content, password) => {
  const mutation = `
      mutation CreateCommentToPost($postId: String!, $content: String!, $password: String!) {
        addCommentToPost(postId: $postId, content: $content, password: $password) {
          id
          content
          createdAt
        }
      }
    `;

  const variables = { postId, content, password };
  const data = await fetchGraphQL(mutation, variables);
  return data.addCommentToPost;
};

export const getComments = async (postId) => {
  const query = `
        query GetComments($postId: String!) {
            getComments(postId: $postId) {
                id
                content
                createdAt
                reply
                parentId
                depth
                replyTo
            },
        }
    `;

  const variables = { postId };
  const data = await fetchGraphQL(query, variables);

  return data.getComments.map(comment => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    reply: comment.reply,
    parentId: comment.parentId,
    depth: comment.depth,
    replyTo: comment.replyTo
  }));
};


export const deleteComment = async (commentId, password) => {
  const mutation = `
      mutation DeleteComment($commentId: String!, $password: String!) {
        deleteComment(commentId: $commentId, password: $password)
      }
    `;

  const variables = { commentId, password };

  try {
    const data = await fetchGraphQL(mutation, variables);

    if (data.deleteComment) {
      return ('성공적으로 삭제되었습니다.')
    }
  } catch (error) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }
}

export const deletePost = async (postId, password) => {
  const mutation = `
      mutation deletePost($postId: String!, $password: String!) {
        deletePost(postId: $postId, password: $password)
      }
    `;

  const variables = { postId, password };

  try {
    const data = await fetchGraphQL(mutation, variables);

    if (data.deletePost) {
      return ('성공적으로 삭제되었습니다.')
    }
  } catch (error) {
    throw new Error('비밀번호가 일치하지 않습니다.');
  }
};

export const createReply = async (commentId, content, password, replyTo) => {
  const mutation = `
        mutation CreateReply($commentId: String!, $content: String!, $password: String!, $replyTo: String!) {
            createReply(commentId: $commentId, content: $content, password: $password, replyTo: $replyTo) {
                id
                content
                createdAt
                replyTo
            }
        }
    `;

  const variables = { commentId, content, password, replyTo };
  const data = await fetchGraphQL(mutation, variables);
  return data.CreateReply;
};