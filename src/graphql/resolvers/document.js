import documentQuery from 'graphql/queries/document';
import documentThreadsQuery from 'graphql/queries/documentThreads';

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

const deleteThreadFromDocument = (
  _root,
  { documentId, threadId },
  { client }
) => {
  const data = client.readQuery({
    query: documentThreadsQuery,
    variables: { id: documentId, queryParams: { order: 'desc' } },
  });
  if (!data) return null;
  const { items, pageToken, __typename } = data.documentThreads;

  const index = items.findIndex(i => i.discussion.id === threadId);
  client.writeQuery({
    query: documentThreadsQuery,
    variables: { id: documentId, queryParams: { order: 'desc' } },
    data: {
      documentThreads: {
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
  deleteThreadFromDocument,
};
