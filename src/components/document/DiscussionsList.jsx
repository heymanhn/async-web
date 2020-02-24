import React, { useContext, useRef, useState } from 'react';
import styled from '@emotion/styled';

import documentDiscussionsQuery from 'graphql/queries/documentDiscussions';
import usePaginatedResource from 'utils/hooks/usePaginatedResource';
import {
  DocumentContext,
  DiscussionContext,
  DEFAULT_DISCUSSION_CONTEXT,
} from 'utils/contexts';

import NotFound from 'components/navigation/NotFound';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import DiscussionMessage from 'components/discussion/DiscussionMessage';
import DiscussionListItem from './DiscussionListItem';

const Container = styled.div(({ theme: { documentViewport } }) => ({
  margin: '60px auto',
  width: documentViewport,
}));

const StyledLoadingIndicator = styled(LoadingIndicator)({
  margin: '40px auto',
});

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
  background: colors.blue,
  borderRadius: '5px',
  cursor: 'pointer',
  padding: '5px 20px',
}));

const Label = styled.div(({ theme: { colors } }) => ({
  color: colors.white,
  fontSize: '14px',
  fontWeight: 500,
  letterSpacing: '-0.006em',
}));

// HN: There should be a way to DRY up these style declarations
const StyledDiscussionMessage = styled(DiscussionMessage)(
  ({ theme: { colors } }) => ({
    background: colors.white,
    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
    margin: '40px 0',
  })
);

const DiscussionsList = () => {
  const listRef = useRef(null);
  const { documentId } = useContext(DocumentContext);

  const [isComposing, setIsComposing] = useState(false);
  const [discussionId, setDiscussionId] = useState(null);

  const startComposing = () => setIsComposing(true);
  const stopComposing = () => {
    setDiscussionId(null);
    setIsComposing(false);
  };

  const { loading, data } = usePaginatedResource(listRef, {
    query: documentDiscussionsQuery,
    key: 'documentDiscussions',
    variables: { id: documentId, queryParams: { order: 'desc' } },
  });

  if (loading) return <StyledLoadingIndicator color="borderGrey" />;
  if (!data) return <NotFound />;

  const { items } = data;
  const discussions = (items || []).map(i => i.discussion);
  const discussionCount = discussions.length;

  if (!discussionCount && !isComposing) setIsComposing(true);

  const value = {
    ...DEFAULT_DISCUSSION_CONTEXT,
    discussionId,
    afterCreateDraft: id => setDiscussionId(id),
  };

  return (
    <Container ref={listRef}>
      <TitleSection>
        <Title>{discussionCount ? 'Discussions' : 'Start a discussion'}</Title>
        <StartDiscussionButton onClick={startComposing}>
          <Label>Start a discussion</Label>
        </StartDiscussionButton>
      </TitleSection>
      <DiscussionContext.Provider value={value}>
        {isComposing && (
          <StyledDiscussionMessage
            mode="compose"
            afterCreate={stopComposing}
            handleCancel={stopComposing}
          />
        )}
      </DiscussionContext.Provider>
      {discussions.map(d => (
        <DiscussionListItem key={d.id} discussionId={d.id} />
      ))}
    </Container>
  );
};

export default DiscussionsList;
