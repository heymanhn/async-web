/*
 * Derivative of <DiscussionThread />, used for the Roval v2 UX
 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from 'react-apollo';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import useInfiniteScroll from 'utils/hooks/useInfiniteScroll';
// import useMountEffect from 'utils/hooks/useMountEffect';
// import useViewedReaction from 'utils/hooks/useViewedReaction';
import { snakedQueryParams } from 'utils/queryParams';

import DiscussionReply from './DiscussionReply';
import ReplyComposer from './ReplyComposer';

// HN: Change the new reply UI to a different background color
import NewRepliesIndicator from './NewRepliesIndicator';

const Container = styled.div(({ theme: { discussionViewport } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
  margin: '0 auto',
  maxWidth: discussionViewport,
}));

const StyledDiscussionReply = styled(DiscussionReply)(({ theme: { colors } }) => ({
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  borderBottom: `1px solid ${colors.borderGrey}`,
  paddingBottom: '10px',
}));

const InlineDiscussionThread = ({ discussionId, documentId, handleClose }) => {
  // const client = useApolloClient();
  const discussionRef = useRef(null);
  const [shouldFetch, setShouldFetch] = useInfiniteScroll(discussionRef);
  const [isFetching, setIsFetching] = useState(false);

  // TODO: Re-enabling this when viewed reactions are supported in discussions
  // const { markAsRead } = useViewedReaction();
  // useMountEffect(() => {
  //   client.writeData({ data: { pendingReplies: [] } });

  //   markAsRead({
  //     isUnread,
  //     objectType: 'discussion',
  //     objectId: discussionId,
  //     parentId: documentId,
  //   });
  // });

  const { loading, error, data, fetchMore } = useQuery(discussionQuery, {
    variables: { id: discussionId, queryParams: {} },
  });

  if (loading) return null;
  if (error || !data.replies) return <div>{error}</div>;

  const { draft } = data.discussion;
  const { items, replyCount, pageToken } = data.replies;
  const replies = (items || []).map(i => i.reply);

  function fetchMoreReplies() {
    const newQueryParams = {};
    if (pageToken) newQueryParams.pageToken = pageToken;

    fetchMore({
      query: discussionQuery,
      variables: { id: discussionId, queryParams: snakedQueryParams(newQueryParams) },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const { items: previousItems } = previousResult.replies;
        const { items: newItems, pageToken: newToken } = fetchMoreResult.replies;
        setShouldFetch(false);
        setIsFetching(false);

        return {
          discussion: fetchMoreResult.discussion,
          replies: {
            pageToken: newToken,
            replyCount: fetchMoreResult.replies.replyCount,
            items: [...previousItems, ...newItems],
            __typename: fetchMoreResult.replies.__typename,
          },
        };
      },
    });
  }

  if (shouldFetch && pageToken && !isFetching) {
    setIsFetching(true);
    fetchMoreReplies();
  }

  function firstNewReplyId() {
    const targetReply = replies.find(m => m.tags && m.tags.includes('new_replies'));

    return targetReply ? targetReply.id : null;
  }

  return (
    <Container ref={discussionRef}>
      {replies.map(m => (
        <React.Fragment key={m.id}>
          {firstNewReplyId() === m.id && m.id !== replies[0].id && <NewRepliesIndicator />}
          <StyledDiscussionReply
            discussionId={discussionId}
            documentId={documentId}
            initialReply={m}
          />
        </React.Fragment>
      ))}
      {!pageToken && (
        <ReplyComposer
          discussionId={discussionId}
          draft={draft}
          documentId={documentId}
          handleClose={handleClose}
          replyCount={replyCount}
        />
      )}
    </Container>
  );
};

InlineDiscussionThread.propTypes = {
  discussionId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  // isUnread: PropTypes.bool.isRequired,
};

export default InlineDiscussionThread;
