import React from 'react';
import { useQuery } from 'react-apollo';
import PropTypes from 'prop-types';

import discussionQuery from 'graphql/queries/discussion';

import NotFound from 'components/navigation/NotFound';
import Document from 'components/document/Document';

const DiscussionLinkHandler = ({ discussionId }) => {
  const { loading, error, data } = useQuery(discussionQuery, {
    variables: { id: discussionId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.discussion) return <NotFound />;

  const { documentId } = data.discussion;

  return <Document documentId={documentId} discussionId={discussionId} />;
};

DiscussionLinkHandler.propTypes = {
  discussionId: PropTypes.string.isRequired,
};

export default DiscussionLinkHandler;
