import React, { useContext, useMemo, useState } from 'react';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import useTopicEditorProps from 'hooks/thread/useTopicEditorProps';
import useTopicGenerator from 'hooks/thread/useTopicGenerator';
import useMountEffect from 'hooks/shared/useMountEffect';
import withLinks from 'plugins/editor/withLinks';
import withSectionBreak from 'plugins/editor/withSectionBreak';
import withThreads from 'plugins/editor/withThreads';
import { ThreadContext } from 'utils/contexts';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.grey7,
}));

const TopicEditable = styled(Editable)(({ theme: { colors, fontProps } }) => ({
  ...fontProps({ size: 16, weight: 400 }),
  padding: '10px 30px 25px',

  span: {
    color: `${colors.grey3} !important`,
  },

  '*': {
    ':last-of-type': {
      marginBottom: 0,
    },
  },
}));

const TopicComposer = React.forwardRef((props, topicRef) => {
  const { topic } = useContext(ThreadContext);

  const editor = useMemo(
    () =>
      compose(
        withThreads,
        withLinks,
        withSectionBreak,
        withReact
      )(createEditor()),
    []
  );
  const editorProps = useTopicEditorProps();
  const [content, setContent] = useState(
    topic ? JSON.parse(topic.payload) : []
  );
  const generateTopic = useTopicGenerator(editor);
  useMountEffect(() => {
    if (!topic) generateTopic();
  });

  return (
    <Container {...props} ref={topicRef}>
      <Slate editor={editor} value={content} onChange={v => setContent(v)}>
        <TopicEditable readOnly {...editorProps} />
      </Slate>
    </Container>
  );
});

export default TopicComposer;
