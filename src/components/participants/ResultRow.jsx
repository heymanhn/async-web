import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import Avatar from 'components/shared/Avatar';

const Container = styled.div(
  ({ isDisabled, isSelected, theme: { colors } }) => ({
    display: 'flex',
    alignItems: 'center',
    background: isSelected ? colors.grey7 : 'none',
    cursor: isDisabled ? 'default' : 'pointer',
    margin: '7px 0',
    padding: '3px 15px',
    userSelect: 'none',

    ':hover': {
      background: colors.grey7,
    },
  })
);

const StyledAvatar = styled(Avatar)(({ isDisabled }) => ({
  flexShrink: 0,
  marginRight: '12px',
  opacity: isDisabled ? 0.5 : 1,
}));

const Details = styled.div({
  fontSize: '14px',
  letterSpacing: '-0.006em',
});

const Name = styled.div(({ isDisabled, theme: { colors } }) =>
  isDisabled
    ? {
        color: colors.grey4,
      }
    : {
        fontWeight: 600,
      }
);

const Email = styled.div(({ isDisabled, theme: { colors } }) => ({
  color: isDisabled ? colors.grey4 : colors.grey2,
}));

const ResultRow = ({
  handleAddSelection,
  index,
  isDisabled,
  isSelected,
  result,
  updateSelectedIndex,
  ...props
}) => {
  const resultRef = useRef(null);

  useEffect(() => {
    if (isSelected) {
      // the options argument is not supported in IE:
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
      resultRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isSelected]);

  const handleClick = () => {
    return isDisabled ? null : handleAddSelection(result);
  };

  const { email, fullName, profilePictureUrl } = result;

  // TODO (HN): Render the workspace as well.

  return (
    <Container
      isDisabled={isDisabled}
      isSelected={isSelected}
      onClick={handleClick}
      onMouseOver={() => updateSelectedIndex(index)}
      onFocus={() => updateSelectedIndex(index)}
      ref={resultRef}
      {...props}
    >
      <StyledAvatar
        alt={fullName}
        avatarUrl={profilePictureUrl}
        isDisabled={isDisabled}
        size={32}
        title={fullName}
      />
      <Details>
        <Name isDisabled={isDisabled}>
          {`${fullName}${isDisabled ? ' (joined)' : ''}`}
        </Name>
        <Email isDisabled={isDisabled}>{email}</Email>
      </Details>
    </Container>
  );
};

ResultRow.propTypes = {
  handleAddSelection: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  result: PropTypes.object.isRequired,
  updateSelectedIndex: PropTypes.func.isRequired,
};

export default ResultRow;
