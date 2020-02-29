/*
 * Custom Title editable div, primarily to work around focus issues with
 * multiple Slate instances on the page.
 *
 * Tracking issue: https://github.com/ianstormtaylor/slate/pull/3506
 */
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

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

/*
 * SLATE UPGRADE TODO:
 * - Handle autofocus on open (passed from parent)
 * - Pressing Enter changes focus to the beginning of the content
 */

const TitleEditable = ({ initialTitle, handleUpdateTitle, ...props }) => {
  const titleRef = useRef(null);
  const [showPlaceholder, setShowPlaceholder] = useState(!initialTitle);

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

  const handleKeyDown = event => {};

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
        onKeyDown={handleKeyDown}
        spellCheck={false}
        {...props}
      />
      {showPlaceholder && (
        <Placeholder onClick={handleSelectTitle}>Untitled Document</Placeholder>
      )}
    </Container>
  );
};

TitleEditable.propTypes = {
  initialTitle: PropTypes.string,
  handleUpdateTitle: PropTypes.func.isRequired,
};

TitleEditable.defaultProps = {
  initialTitle: '',
};

export default TitleEditable;
