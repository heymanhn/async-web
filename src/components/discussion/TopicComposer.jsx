import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import discussionQuery from 'graphql/queries/discussion';
import updateDiscussionMutation from 'graphql/mutations/updateDiscussion';
import { track } from 'utils/analytics';
import { DiscussionContext } from 'utils/contexts';

import { DEFAULT_BLOCK, toPlainText } from 'components/editor/utils';

const TopicEditable = styled(Editable)(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '42px',
  fontWeight: 600,
  letterSpacing: '-0.022em',
  lineHeight: '54px',
  marginBottom: '30px',
  marginLeft: '20px',
  width: '100%',
  outline: 'none',
}));

const TopicComposer = ({ initialTopic, ...props }) => {
  const { discussionId } = useContext(DiscussionContext);
  const topicEditor = useMemo(() => withReact(createEditor()), []);
  const [topic, setTopic] = useState(
    initialTopic ? JSON.parse(initialTopic) : DEFAULT_BLOCK
  );
  const [updateDiscussion] = useMutation(updateDiscussionMutation);

  async function handleUpdate() {
    const { data: updateDiscussionTopicData } = await updateDiscussion({
      variables: {
        discussionId,
        input: {
          topic: {
            formatter: 'slatejs',
            text: toPlainText(topic),
            payload: JSON.stringify(topic),
          },
        },
      },
      refetchQueries: [
        {
          query: discussionQuery,
          variables: { discussionId, queryParams: {} },
        },
      ],
    });

    if (updateDiscussionTopicData.updateDiscussion) {
      track('Discussion topic updated', { discussionId });
    }
  }

  return (
    <Slate editor={topicEditor} value={topic} onChange={v => setTopic(v)}>
      <TopicEditable
        onBlur={handleUpdate}
        placeholder="Untitled Discussion"
        {...props}
      />
    </Slate>
  );
};

TopicComposer.propTypes = {
  initialTopic: PropTypes.string,
};

TopicComposer.defaultProps = {
  initialTopic: '',
};

export default TopicComposer;
