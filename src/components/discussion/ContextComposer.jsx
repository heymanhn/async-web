import React, { useContext, useMemo, useState } from 'react';
import { compose } from 'recompose';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import { DiscussionContext } from 'utils/contexts';
import useMountEffect from 'utils/hooks/useMountEffect';

import useContextEditorProps from 'components/editor/useContextEditorProps';
import withInlineDiscussions from 'components/editor/withInlineDiscussions';
import withLinks from 'components/editor/withLinks';
import withVoidElements from 'components/editor/withVoidElements';
import useContextGenerator from './useContextGenerator';

const Container = styled.div(({ theme: { colors } }) => ({
  background: colors.grey7,
}));

const ContextEditable = styled(Editable)(({ theme: { colors } }) => ({
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '-0.011em',
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
  const { context, setContext } = useContext(DiscussionContext);

  const contextEditor = useMemo(
    () =>
      compose(
        withInlineDiscussions,
        withLinks,
        withVoidElements,
        withReact
      )(createEditor()),
    []
  );
  const editorProps = useContextEditorProps();
  const [content, setContent] = useState(context || []);
  const generateContext = useContextGenerator(contextEditor);
  useMountEffect(() => {
    if (!context) generateContext();
  });

  if (!context && content.length) setContext(content);

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
