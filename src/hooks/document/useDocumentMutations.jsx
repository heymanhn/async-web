import { useContext, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';

import resourcesQuery from 'graphql/queries/resources';
import createDocumentMutation from 'graphql/mutations/createDocument';
import updateDocumentMutation from 'graphql/mutations/updateDocument';
import deleteDocumentMutation from 'graphql/mutations/deleteDocument';
import localDeleteUserResourceMtn from 'graphql/mutations/local/deleteUserResource';
import useRefetchWorkspaceResources from 'hooks/resources/useRefetchWorkspaceResources';
import { track } from 'utils/analytics';
import { getLocalUser } from 'utils/auth';
import { RESOURCES_QUERY_SIZE } from 'utils/constants';
import { DocumentContext } from 'utils/contexts';
import { toPlainText } from 'utils/editor/constants';
import { snakedQueryParams } from 'utils/queryParams';

const useDocumentMutations = () => {
  const {
    documentId,
    afterUpdateDocumentTitle,
    afterDeleteDocument,
  } = useContext(DocumentContext);
  const checkRefetchWorkspaceResources = useRefetchWorkspaceResources({
    resourceType: 'document',
    resourceId: documentId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createDocument] = useMutation(createDocumentMutation);
  const [updateDocument] = useMutation(updateDocumentMutation);
  const [deleteDocument] = useMutation(deleteDocumentMutation, {
    variables: { documentId },
  });
  const [localDeleteUserResource] = useMutation(localDeleteUserResourceMtn);

  const handleCreateDocument = async () => {
    setIsSubmitting(true);

    const { userId } = getLocalUser();
    const { data } = await createDocument({
      variables: { input: {} },
      refetchQueries: [
        {
          query: resourcesQuery,
          variables: {
            userId,
            queryParams: snakedQueryParams({ size: RESOURCES_QUERY_SIZE }),
          },
        },
      ],
    });

    if (data.createDocument) {
      const { id } = data.createDocument;
      track('New document created', { documentId: id });

      setIsSubmitting(false);
      return Promise.resolve({ id });
    }

    return Promise.reject(new Error('Failed to create new document'));
  };

  const handleUpdateDocument = async ({ content }) => {
    const { data } = await updateDocument({
      variables: {
        documentId,
        input: {
          body: {
            formatter: 'slatejs',
            text: toPlainText(content),
            payload: JSON.stringify(content),
          },
        },
      },
    });

    if (data.updateDocument) return Promise.resolve();

    return Promise.reject(new Error('Failed to update document'));
  };

  const handleUpdateDocumentTitle = async title => {
    const refetchQueries = await checkRefetchWorkspaceResources();
    const { data } = await updateDocument({
      variables: { documentId, input: { title } },
      refetchQueries,
    });

    if (data.updateDocument) {
      track('Document title updated', { documentId });
      afterUpdateDocumentTitle(title);
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to update document title'));
  };

  const handleDeleteDocument = async () => {
    const refetchQueries = await checkRefetchWorkspaceResources();
    const { data } = await deleteDocument({ refetchQueries });

    if (data.deleteDocument) {
      localDeleteUserResource({ variables: { resourceId: documentId } });
      afterDeleteDocument();
      return Promise.resolve();
    }

    return Promise.reject(new Error('Failed to delete document'));
  };

  return {
    isSubmitting,

    handleCreateDocument,
    handleUpdateDocument,
    handleUpdateDocumentTitle,
    handleDeleteDocument,
  };
};

export default useDocumentMutations;
