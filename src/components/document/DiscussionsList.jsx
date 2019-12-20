import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';

import NotFound from 'components/navigation/NotFound';
import DiscussionContainer from 'components/discussion/DiscussionContainer';
import HeaderBar from './HeaderBar';

const Container = styled.div({

});

const StyledDiscussionContainer = styled(DiscussionContainer)(
  ({ theme: { colors, documentViewport } }) => ({
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    margin: '40px auto',
    width: documentViewport,
  }),
);

const DiscussionsList = ({ documentId }) => {
  const { loading, error, data } = useQuery(documentDiscussionsQuery, {
    variables: { id: documentId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.documentDiscussions) return <NotFound />;

  const { items } = data.documentDiscussions;
  const discussions = (items || []).map(i => i.discussion);

  return (
    <>
      <HeaderBar documentId={documentId} />
      <Container>
        {discussions.map(d => (
          <StyledDiscussionContainer
            discussionId={d.id}
            documentId={documentId}
            key={d.id}
          />
        ))}
      </Container>
    </>
  );
};

DiscussionsList.propTypes = {
  documentId: PropTypes.string.isRequired,
};

export default DiscussionsList;
