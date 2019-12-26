import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentPlus } from '@fortawesome/pro-solid-svg-icons';
import styled from '@emotion/styled';

import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import { snakedQueryParams } from 'utils/queryParams';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';

import NotFound from 'components/navigation/NotFound';
import DiscussionContainer from 'components/discussion/DiscussionContainer';
import InlineDiscussionComposer from 'components/discussion/InlineDiscussionComposer';

const Container = styled.div(({ theme: { documentViewport } }) => ({
  margin: '60px auto',
  width: documentViewport,
}));

const TitleSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.altContentText,
  fontSize: '32px',
  fontWeight: 600,
  letterSpacing: '-0.021em',
}));

const StartDiscussionButton = styled.div(({ theme: { colors } }) => ({
  display: 'flex',
  alignItems: 'center',
  background: colors.bgGrey,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '4px 15px',
}));

const StartDiscussionIcon = styled(FontAwesomeIcon)(({ theme: { colors } }) => ({
  color: colors.grey1,
  fontSize: '18px',
  marginRight: '12px',
}));

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
}));

// HN: There should be a way to DRY up these style declarations
const StyledComposer = styled(InlineDiscussionComposer)(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  margin: '40px 0',
}));

const StyledDiscussionContainer = styled(DiscussionContainer)(({ theme: { colors } }) => ({
  background: colors.white,
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
  margin: '40px 0',
}));

const DiscussionsList = ({ documentId }) => {
  const listRef = useRef(null);
  const [showComposer, setShowComposer] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(listRef);

  function handleShowComposer() { setShowComposer(true); }
  function handleHideComposer() { setShowComposer(false); }

  const { loading, error, data, fetchMore } = useQuery(documentDiscussionsQuery, {
    variables: { id: documentId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.documentDiscussions) return <NotFound />;

  const { items, pageToken } = data.documentDiscussions;
  const discussions = (items || []).map(i => i.discussion);

  function afterCreate() {
    handleHideComposer();
  }

  function fetchMoreDiscussions() {
    const newQueryParams = {};
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: documentDiscussionsQuery,
      variables: { id: documentId, queryParams: snakedQueryParams(newQueryParams) },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.documentDiscussions;
        const { items: newItems, pageToken: newToken } = fetchMoreResult.documentDiscussions;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          documentDiscussions: {
            pageToken: newToken,
            totalHits: fetchMoreResult.documentDiscussions.totalHits,
            items: [...previousItems, ...newItems],
            __typename: fetchMoreResult.documentDiscussions.__typename,
          },
        };
      },
    });
  }

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreDiscussions();
  }

  return (
    <Container ref={listRef}>
      <TitleSection>
        <Title>Discussions</Title>
        <StartDiscussionButton onClick={handleShowComposer}>
          <StartDiscussionIcon icon={faCommentPlus} />
          <Label>Start a discussion</Label>
        </StartDiscussionButton>
      </TitleSection>
      {showComposer && (
        <StyledComposer
          afterCreate={afterCreate}
          documentId={documentId}
          handleClose={handleHideComposer}
        />
      )}
      {discussions.map(d => (
        <StyledDiscussionContainer
          discussionId={d.id}
          documentId={documentId}
          key={d.id}
        />
      ))}
    </Container>
  );
};

DiscussionsList.propTypes = {
  documentId: PropTypes.string.isRequired,
};

export default DiscussionsList;
