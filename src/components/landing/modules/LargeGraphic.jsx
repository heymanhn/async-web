import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import {
  SmallTitle as Title,
  SmallDescription as Description,
  TitleIcon,
  Image,
} from './styles';
import GridItem from './GridItem';

const Container = styled.div(({ theme: { bgColors, mq } }) => ({
  display: 'flex',
  flexDirection: 'column',

  background: bgColors.main,
  padding: '60px 30px',

  [mq('tabletUp')]: {
    alignItems: 'center',
    padding: '80px 30px',
  },
}));

const StyledTitle = styled(Title)(({ theme: { mq } }) => ({
  [mq('tabletUp')]: {
    maxWidth: '520px',
    textAlign: 'center',
  },
}));

const StyledDescription = styled(Description)(({ theme: { mq } }) => ({
  marginBottom: '30px',

  [mq('tabletUp')]: {
    maxWidth: '580px',
    textAlign: 'center',
  },
}));

const FeatureGrid = styled.div(({ theme: { mq } }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',

  marginTop: '25px',

  [mq('tabletUp')]: {
    maxWidth: '800px',
  },
}));

const LargeGraphic = ({
  icon,
  title,
  description,
  image,
  features,
  ...props
}) => (
  <Container {...props}>
    {icon && <TitleIcon icon={icon} />}
    <StyledTitle>{title}</StyledTitle>
    <StyledDescription>{description}</StyledDescription>
    <Image srcSet={`${image} 2x`} />
    <FeatureGrid>
      {!!features.length &&
        features.map((feature, i) => <GridItem key={i} {...feature} />)}
    </FeatureGrid>
  </Container>
);

LargeGraphic.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  features: PropTypes.array,
};

LargeGraphic.defaultProps = {
  icon: null,
  features: [],
  description: '',
};

export default LargeGraphic;
