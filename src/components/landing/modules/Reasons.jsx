/* eslint react/no-array-index-key: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import {
  SmallTitle as Title,
  SmallDescription as Description,
  TitleIcon,
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
  marginBottom: '25px',

  [mq('tabletUp')]: {
    maxWidth: '580px',
    textAlign: 'center',
  },
}));

const Grid = styled.div(({ theme: { mq } }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',

  [mq('tabletUp')]: {
    maxWidth: '800px',
  },
}));

const Reasons = ({ icon, title, description, reasons, ...props }) => (
  <Container {...props}>
    {icon && <TitleIcon icon={icon} />}
    <StyledTitle>{title}</StyledTitle>
    <StyledDescription>{description}</StyledDescription>
    <Grid>
      {reasons.map((reason, i) => (
        <GridItem key={i} {...reason} />
      ))}
    </Grid>
  </Container>
);

Reasons.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  reasons: PropTypes.array,
};

Reasons.defaultProps = {
  icon: null,
  reasons: [],
};

export default Reasons;
