import localStateQuery from 'graphql/queries/localState';
import discussionQuery from 'graphql/queries/discussion';

function addDraftToDiscussion(_root, { discussionId, draft }, { client }) {
  const data = client.readQuery({
    query: discussionQuery,
    variables: { id: discussionId, queryParams: {} },
  });
  if (!data) return null;

  const { discussion, replies } = data;

  client.writeQuery({
    query: discussionQuery,
    variables: { id: discussionId, queryParams: {} },
    data: {
      discussion: {
        ...discussion,
        draft,
      },
      replies,
    },
  });

  return null;
}

// Cheeky. I know. But it works
function deleteDraftFromDiscussion(_root, { discussionId }, { client }) {
  return addDraftToDiscussion(_root, { discussionId, draft: null }, { client });
}

function addNewReplyToDiscussion(_root, { isUnread, reply }, { client }) {
  const { body: newBody, author: newAuthor, discussionId } = reply;

  const data = client.readQuery({
    query: discussionQuery,
    variables: { id: discussionId, queryParams: {} },
  });
  if (!data) return null;

  const {
    discussion,
    replies: { pageToken, items, __typename, replyCount },
  } = data;

  const newReplyItem = {
    __typename: 'ReplyItem',
    reply: {
      __typename: 'Reply',
      ...reply,
      author: {
        __typename: 'Author',
        ...newAuthor,
      },
      body: {
        __typename: 'Body',
        ...newBody,
      },
      tags: isUnread ? ['new_reply'] : null,
    },
  };

  client.writeQuery({
    query: discussionQuery,
    variables: { id: discussionId, queryParams: {} },
    data: {
      discussion,
      replies: {
        replyCount: replyCount + 1,
        pageToken,
        items: [...(items || []), newReplyItem],
        __typename,
      },
    },
  });

  return null;
}

function addPendingRepliesToDiscussion(_root, { discussionId }, { client }) {
  const { pendingReplies } = client.readQuery({ query: localStateQuery });

  const data = client.readQuery({
    query: discussionQuery,
    variables: { id: discussionId, queryParams: {} },
  });
  if (!data) return null;

  const {
    discussion,
    replies: { pageToken, items, __typename, replyCount },
  } = data;

  const pendingReplyItems = pendingReplies.map(r => ({
    __typename: items[0].__typename,
    reply: r,
  }));

  client.writeQuery({
    query: discussionQuery,
    variables: { id: discussionId, queryParams: {} },
    data: {
      discussion,
      replies: {
        replyCount: replyCount + pendingReplyItems.length,
        pageToken,
        items: [...items, ...pendingReplyItems],
        __typename,
      },
    },
  });

  client.writeData({ data: { pendingReplies: [] } });

  return null;
}

const localResolvers = {
  Mutation: {
    addDraftToDiscussion,
    deleteDraftFromDiscussion,
    addNewReplyToDiscussion,
    addPendingRepliesToDiscussion,
  },
};

export default localResolvers;
