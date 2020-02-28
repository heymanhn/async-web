import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import useDocumentMutations from 'utils/hooks/useDocumentMutations';

/*
 * SLATE UPGRADE TODO:
 * - any pasted text is converted to one line of plain text before it's saved
 *   to the title
 * - Pressing Enter changes focus to the beginning of the content
 */

const Container = styled.div({
  display: 'flex',
  position: 'relative',
});

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.mainText,
  fontSize: '42px',
  fontWeight: 600,
  letterSpacing: '-0.022em',
  lineHeight: '54px',
  marginTop: '60px',
  marginBottom: '15px',
  outline: 'none',
  width: '100%',
}));

const Placeholder = styled(Title)(({ theme: { colors } }) => ({
  color: colors.titlePlaceholder,
  cursor: 'text',
  position: 'absolute',
  userSelect: 'none',
}));

const TitleComposer = ({ initialTitle, ...props }) => {
  const titleRef = useRef(null);
  const [showPlaceholder, setShowPlaceholder] = useState(!initialTitle);
  const { handleUpdateTitle } = useDocumentMutations();

  const handleCheckPlaceholder = event => {
    event.preventDefault();
    const { current } = titleRef || {};

    if (current && !!current.innerText === showPlaceholder) {
      setShowPlaceholder(!showPlaceholder);
    }
  };

  const handleSelectTitle = event => {
    event.preventDefault();
    const { current } = titleRef || {};

    if (current) current.focus();
  };

  const handleUpdate = () => {
    const { current } = titleRef || {};
    if (!current) return null;

    return handleUpdateTitle(current.innerText);
  };

  return (
    <Container>
      <Title
        contentEditable
        ref={titleRef}
        dangerouslySetInnerHTML={{ __html: initialTitle }}
        onBlur={handleUpdate}
        onInput={handleCheckPlaceholder}
        spellCheck={false}
        {...props}
      />
      {showPlaceholder && (
        <Placeholder onClick={handleSelectTitle}>Untitled Document</Placeholder>
      )}
    </Container>
  );
};

TitleComposer.propTypes = {
  initialTitle: PropTypes.string,
};

TitleComposer.defaultProps = {
  initialTitle: '',
};

export default TitleComposer;
