import React from 'react';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';

import discussionQuery from 'graphql/queries/discussion';

import NotFound from 'components/navigation/NotFound';
import DocumentContainer from 'components/document/DocumentContainer';

const DiscussionLinkHandler = ({ discussionId }) => {
  const { loading, error, data } = useQuery(discussionQuery, {
    variables: { discussionId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.discussion) return <NotFound />;

  const { documentId } = data.discussion;

  return (
    <DocumentContainer documentId={documentId} discussionId={discussionId} />
  );
};

DiscussionLinkHandler.propTypes = {
  discussionId: PropTypes.string.isRequired,
};

export default DiscussionLinkHandler;
