import documentQuery from 'graphql/queries/document';
import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';

const updateDocumentTitle = (_root, { documentId, title }, { client }) => {
  const data = client.readQuery({
    query: documentQuery,
    variables: { documentId },
  });

  if (!data) return null;

  client.writeQuery({
    query: documentQuery,
    variables: { documentId },
    data: {
      document: {
        ...data.document,
        title,
      },
    },
  });

  return null;
};

const deleteDiscussionFromDocument = (
  _root,
  { documentId, discussionId },
  { client }
) => {
  const {
    documentDiscussions: { items, pageToken, __typename },
  } = client.readQuery({
    query: documentDiscussionsQuery,
    variables: { id: documentId, queryParams: { order: 'desc' } },
  });

  const index = items.findIndex(i => i.discussion.id === discussionId);
  client.writeQuery({
    query: documentDiscussionsQuery,
    variables: { id: documentId, queryParams: { order: 'desc' } },
    data: {
      documentDiscussions: {
        items: [...items.slice(0, index), ...items.slice(index + 1)],
        pageToken,
        __typename,
      },
    },
  });

  return null;
};

export default {
  updateDocumentTitle,
  deleteDiscussionFromDocument,
};
