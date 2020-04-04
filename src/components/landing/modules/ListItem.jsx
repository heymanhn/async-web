import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Container = styled.div({
  display: 'flex',
  marginBottom: '20px',

  ':last-of-type': {
    marginBottom: 0,
  },
});

const Icon = styled(FontAwesomeIcon)(({ theme: { accentColor } }) => ({
  fontSize: '20px',
  color: accentColor,
  marginTop: '3px',
  marginRight: '12px',
}));

const Details = styled.div({
  fontSize: '16px',
  lineHeight: '26px',
});

const Title = styled.span(({ theme: { textColors } }) => ({
  color: textColors.main,
  fontWeight: 600,
  marginRight: '4px',
}));

const Description = styled.span(({ theme: { textColors } }) => ({
  color: textColors.sub,
}));

const ListItem = ({ icon, title, description, lineBreak, ...props }) => {
  return (
    <Container {...props}>
      <Icon icon={icon} />
      <Details>
        <Title>{title}</Title>
        {lineBreak && <br />}
        <Description>{description}</Description>
      </Details>
    </Container>
  );
};

ListItem.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  lineBreak: PropTypes.bool,
};

ListItem.defaultProps = {
  icon: 'arrow-circle-right',
  lineBreak: false,
};

export default ListItem;
