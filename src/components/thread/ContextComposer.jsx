import React, { useContext, useMemo, useState } from 'react';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import useContextEditorProps from 'hooks/thread/useContextEditorProps';
import useContextGenerator from 'hooks/thread/useContextGenerator';
import useMountEffect from 'hooks/shared/useMountEffect';
import withLinks from 'plugins/editor/withLinks';
import withSectionBreak from 'plugins/editor/withSectionBreak';
import withThreads from 'plugins/editor/withThreads';
import { DiscussionContext } from 'utils/contexts';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.grey7,
}));

const ContextEditable = styled(Editable)(({ theme: { colors } }) => ({
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '26px',
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

const ContextComposer = props => {
  const { topic } = useContext(DiscussionContext);

  const contextEditor = useMemo(
    () =>
      compose(
        withThreads,
        withLinks,
        withSectionBreak,
        withReact
      )(createEditor()),
    []
  );
  const editorProps = useContextEditorProps();
  const [content, setContent] = useState(
    topic ? JSON.parse(topic.payload) : []
  );
  const generateContext = useContextGenerator(contextEditor);
  useMountEffect(() => {
    if (!topic) generateContext();
  });

  return (
    <Container {...props}>
      <Slate
        editor={contextEditor}
        value={content}
        onChange={v => setContent(v)}
      >
        <ContextEditable readOnly {...editorProps} />
      </Slate>
    </Container>
  );
};

export default ContextComposer;
