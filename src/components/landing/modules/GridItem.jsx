import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Container = styled.div(({ theme: { bgColors, mq } }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',

  background: bgColors.sub,
  height: '160px',
  width: '100%',
  margin: '5px 0',
  padding: '0 30px',

  [mq('tabletUp')]: {
    height: '180px',
    width: '250px',
    margin: '5px',
  },
}));

const Icon = styled(FontAwesomeIcon)(({ theme: { accentColor } }) => ({
  fontSize: '24px',
  color: accentColor,
  marginBottom: '5px',
}));

const Title = styled.span(({ theme: { textColors } }) => ({
  color: textColors.main,
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '-0.011em',
  marginBottom: '5px',
}));

const Description = styled.span(({ theme: { textColors } }) => ({
  color: textColors.sub,
  fontSize: '14px',
  letterSpacing: '-0.006em',
  lineHeight: '20px',
}));

const GridItem = ({ icon, title, description, ...props }) => {
  return (
    <Container {...props}>
      <Icon icon={icon} />
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Container>
  );
};

GridItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  lineBreak: PropTypes.bool,
};

GridItem.defaultProps = {
  icon: 'arrow-circle-right',
  lineBreak: false,
};

export default GridItem;
