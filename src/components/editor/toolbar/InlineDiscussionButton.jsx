import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';

import { DocumentContext } from 'utils/contexts';

import ToolbarButton from 'components/editor/toolbar/ToolbarButton';
import ButtonIcon from 'components/editor/toolbar/ButtonIcon';

const InlineDiscussionButton = ({ content, ...props }) => {
  const editor = useSlate();
  const { handleShowModal } = useContext(DocumentContext);

  const handleClick = () => {
    const { selection } = editor;

    setTimeout(() => handleShowModal(null, selection, content), 0);

    Transforms.deselect(editor);
  };

  return (
    <ToolbarButton handleClick={handleClick} {...props}>
      <ButtonIcon icon="comment-plus" isActive={false} />
    </ToolbarButton>
  );
};

InlineDiscussionButton.propTypes = {
  content: PropTypes.array.isRequired,
};

export default InlineDiscussionButton;
