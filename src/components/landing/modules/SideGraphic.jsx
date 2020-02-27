/* eslint react/no-array-index-key: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import {
  SmallTitle as Title,
  SmallDescription as Description,
  TitleIcon,
  Image,
} from './styles';
import ListItem from './ListItem';

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

const ContentContainer = styled.div(({ side, theme: { mq } }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginTop: side === 'left' ? '15px' : 0,
  marginBottom: side === 'left' ? 0 : '15px',

  [mq('tabletUp')]: {
    marginLeft: '30px',
    marginRight: '30px',
    maxWidth: '450px',
  },
}));

const List = styled.div({
  marginTop: '25px',
});

const StyledImage = styled(Image)(({ side, theme: { mq } }) => ({
  display: side === 'left' ? 'none' : 'block',
  marginTop: side === 'left' ? 0 : '15px',
  marginBottom: side === 'left' ? '15px' : 0,

  [mq('tabletUp')]: {
    display: 'block',
  },
}));

const SideGraphic = ({
  icon,
  title,
  description,
  image,
  features,
  side,
  ...props
}) => {
  const imageComponent = <StyledImage srcSet={`${image} 2x`} side={side} />;

  return (
    <Container {...props}>
      {side === 'left' && imageComponent}
      <ContentContainer side={side}>
        {icon && <TitleIcon icon={icon} />}
        <Title>{title}</Title>
        <Description>{description}</Description>
        {features.length && (
          <List>
            {features.map((feature, i) => (
              <ListItem key={i} {...feature} />
            ))}
          </List>
        )}
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
  features: PropTypes.array,
  side: PropTypes.oneOf(['left', 'right']).isRequired,
};

SideGraphic.defaultProps = {
  icon: null,
  features: [],
};

export default SideGraphic;
