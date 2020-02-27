import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import {
  SmallTitle as Title,
  SmallDescription as Description,
  TitleIcon,
  Image,
} from './styles';

const Container = styled.div(({ theme: { bgColors, mq } }) => ({
  display: 'flex',
  flexWrap: 'wrap',

  background: bgColors.main,
  padding: '60px 30px',

  [mq('tabletUp')]: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 30px',
  },
}));

const ContentContainer = styled.div(({ theme: { mq } }) => ({
  display: 'flex',
  flexDirection: 'column',

  [mq('tabletUp')]: {
    margin: '0 30px',
    maxWidth: '450px',
  },
}));

const SideGraphic = ({ icon, title, description, image, side }) => {
  const imageComponent = <Image srcSet={`${image} 2x`} />;

  return (
    <Container>
      {side === 'left' && imageComponent}
      <ContentContainer>
        {icon && <TitleIcon icon={icon} />}
        <Title>{title}</Title>
        <Description>{description}</Description>
      </ContentContainer>
      {side === 'right' && imageComponent}
    </Container>
  );
};

SideGraphic.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  side: PropTypes.oneOf(['left', 'right']).isRequired,
};

SideGraphic.defaultProps = {
  icon: null,
};

export default SideGraphic;
