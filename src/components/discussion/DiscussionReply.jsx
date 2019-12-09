/* eslint no-alert: 0 */
import React from 'react';
import styled from '@emotion/styled';

import RovalEditor from 'components/editor/RovalEditor';

const ReplyEditor = styled(RovalEditor)({ });

const DiscussionReply = () => (
  <ReplyEditor
    contentType="discussionReply"
  />
);

export default DiscussionReply;
