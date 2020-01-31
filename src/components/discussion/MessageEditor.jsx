import React, { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import styled from '@emotion/styled';

import { MessageContext } from 'utils/contexts';

import { DEFAULT_VALUE } from 'components/editor/utils';
import useMessageMutations from './useMessageMutations';
import MessageActions from './MessageActions';

const Container = styled.div(({ mode }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: mode === 'compose' ? '160px' : 'initial',
}));

const MessageEditable = styled(Editable)({
  fontSize: '16px',
  fontWeight: 400,
  letterSpacing: '-0.011em',
  lineHeight: '26px',
  marginTop: '15px',
});

/*
 * SLATE UPGRADE TODO:
 * - Get the keyboard shortcuts working for saving the message (cmd + enter)
 * - Create a hook for draft saving
 * - See if we can get rid of the afterCreate() callback with our new structure
 */

const MessageEditor = ({
  handleCancel,
  afterCreate,
  afterUpdate,
  initialMessage,
  ...props
}) => {
  const { mode } = useContext(MessageContext);
  const messageEditor = useMemo(() => withReact(createEditor()), []);
  const [message, setMessage] = useState(
    initialMessage ? JSON.parse(initialMessage) : DEFAULT_VALUE
  );

  const { handleCreate, handleUpdate, isSubmitting } = useMessageMutations({
    message,
    afterCreate,
    afterUpdate,
  });

  const isEmptyMessage = message === JSON.stringify(DEFAULT_VALUE);

  return (
    <Container mode={mode} {...props}>
      <Slate
        editor={messageEditor}
        value={message}
        onChange={v => setMessage(v)}
      >
        <MessageEditable />
        {mode !== 'display' && (
          <MessageActions
            handleSubmit={mode === 'compose' ? handleCreate : handleUpdate}
            handleCancel={handleCancel}
            isDraft={false} // TODO
            isSubmitDisabled={isEmptyMessage}
            isSubmitting={isSubmitting}
          />
        )}
      </Slate>
    </Container>
  );
};

MessageEditor.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  afterCreate: PropTypes.func,
  afterUpdate: PropTypes.func,
  initialMessage: PropTypes.string,
};

MessageEditor.defaultProps = {
  afterCreate: () => {},
  afterUpdate: () => {},
  initialMessage: '',
};

export default MessageEditor;

/*
 mode is needed.

 display:
 - content is read-only
 - no actions buttons show

 compose:
 - content is editable
 - Actions buttons show "post" and "cancel"

 edit:
 - content is editable
 - Actions buttons show "save" and "cancel"
*/
