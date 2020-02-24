import { useContext } from 'react';

import documentQuery from 'graphql/queries/document';
import discussionQuery from 'graphql/queries/discussion';
import { DocumentContext, DiscussionContext } from 'utils/contexts';
import { useQuery } from 'react-apollo';

const useCommandCenterTitle = source => {
  const { documentId } = useContext(DocumentContext);
  const { discussionId } = useContext(DiscussionContext);

  const { data: documentData } = useQuery(documentQuery, {
    variables: { documentId, queryParams: {} },
    skip: !documentId,
  });

  const { data: discussionData } = useQuery(discussionQuery, {
    variables: { discussionId },
    skip: !discussionId,
  });

  switch (source) {
    case 'document':
      if (!documentData || !documentData.document) return null;
      return documentData.document.title || 'Untitled Document';

    case 'discussion':
      if (!discussionData || !discussionData.discussion) return null;
      return discussionData.discussion.topic.text || 'Untitled Discussion';

    default:
      return source[0].toUpperCase() + source.slice(1);
  }
};

export default useCommandCenterTitle;
