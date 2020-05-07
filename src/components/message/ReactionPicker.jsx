import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import { matchCurrentUserId } from 'utils/auth';
import useClickOutside from 'hooks/shared/useClickOutside';
import useReactions from 'hooks/message/useReactions';

import ReactionIcon from './ReactionIcon';

const Container = styled.div(({ isOpen, offset, theme: { colors } }) => ({
  display: isOpen ? 'flex' : 'none',
  flexDirection: 'column',
  alignItems: 'center',

  background: colors.white,
  borderRadius: '5px',
  boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
  marginTop: `${offset}px`,
  opacity: isOpen ? 1 : 0,
  padding: '10px 5px 5px',
  position: 'absolute',
  transition: 'opacity 0.2s',
  zIndex: 4,
}));

const Title = styled.div(({ theme: { colors } }) => ({
  color: colors.grey3,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  fontWeight: 500,
}));

const Divider = styled.div(({ theme: { colors } }) => ({
  borderTop: `1px solid ${colors.borderGrey}`,
  width: '60px',
  margin: '10px 0 5px',
}));

const ReactionsList = styled.div({
  display: 'flex',
  flexDirection: 'row',
});

const ReactionPicker = ({ handleClose, isOpen, placement, ...props }) => {
  const tooltipRef = useRef(null);
  const [reactionOnHover, setReactionOnHover] = useState(null);
  const { getModalCoords } = useModalDimensions(tooltipRef);

  const {
    addReaction,
    reactions,
    reactionsReference,
    removeReaction,
  } = useReactions();

  const handleAddReaction = code => {
    handleClose();
    addReaction(code);
  };

  const handleExitHover = code => {
    if (code !== reactionOnHover) return;
    setReactionOnHover(null);
  };

  const handleRemoveReaction = (reactionId, code) => {
    handleClose();
    removeReaction(reactionId, code);
  };

  const hasReactedWith = code =>
    reactions.findIndex(
      r => matchCurrentUserId(r.author.id) && r.code === code
    ) >= 0;

  const userReactionForCode = code => {
    const reaction = reactions.find(
      r => r.code === code && matchCurrentUserId(r.author.id)
    );
    return reaction ? reaction.id : null;
  };

  const handleClickOutside = () => {
    if (!isOpen) return;
    handleClose({ outsideClick: true });
  };
  useClickOutside({ handleClickOutside, isOpen, ref: tooltipRef });

  // Note: the tooltip is horizontally center-aligned due to the parent's
  // flex display property
  // const adjustedCoords = () => {
  //   const top = placement === 'below' ? 35 : -110; // Aiming for a 5 pixel gap

  //   return getModalCoords({ top, left });
  // };

  const title = reactionOnHover
    ? reactionsReference.find(r => r.code === reactionOnHover).text
    : 'Pick a reaction';

  return (
    <Container
      ref={tooltipRef}
      isOpen={isOpen}
      offset={placement === 'below' ? 25 : -106} // Aiming for an 8 pixel gap
      placement={placement}
      // styles={adjustedCoords()}
      {...props}
    >
      <Title>{title}</Title>
      <Divider />
      <ReactionsList>
        {reactionsReference.map(r => (
          <ReactionIcon
            key={r.code}
            code={r.code}
            existingReactionId={userReactionForCode(r.code)}
            icon={r.icon}
            isSelected={hasReactedWith(r.code)}
            onAddReaction={handleAddReaction}
            onExitHover={handleExitHover}
            onHover={setReactionOnHover}
            onRemoveReaction={handleRemoveReaction}
          />
        ))}
      </ReactionsList>
    </Container>
  );
};

ReactionPicker.propTypes = {
  handleClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  placement: PropTypes.oneOf(['above', 'below']),
};

ReactionPicker.defaultProps = {
  isOpen: false,
  placement: 'above',
};

export default ReactionPicker;
