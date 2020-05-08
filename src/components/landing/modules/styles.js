import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

export const LargeTitle = styled.div(
  ({ theme: { fontProps, mq, textColors } }) => ({
    ...fontProps({ size: 48, weight: 700 }),
    lineHeight: '58px', // custom for large titles

    color: textColors.main,
    margin: '0 auto 20px',

    [mq('tabletUp')]: {
      ...fontProps({ size: 52 }),
      lineHeight: '63px', // custom for large titles
      maxWidth: '550px',
      textAlign: 'center',
    },
  })
);

export const LargeDescription = styled.div(({ theme: { mq, textColors } }) => ({
  color: textColors.alt,
  fontSize: '20px',
  letterSpacing: '-0.017em',
  lineHeight: '32px',
  margin: '0 auto 30px',

  [mq('tabletUp')]: {
    maxWidth: '580px',
    textAlign: 'center',
  },
}));

export const SmallTitle = styled.div(({ theme: { mq, textColors } }) => ({
  color: textColors.main,
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '-0.021em',
  lineHeight: '39px',
  marginBottom: '10px',

  [mq('tabletUp')]: {
    fontSize: '36px',
    lineHeight: '44px',
  },
}));

// Not specifying a letter-spacing for this one. It looks too compressed
// with the recommended value.
export const SmallDescription = styled.div(({ theme: { textColors } }) => ({
  color: textColors.alt,
  fontSize: '18px',
  lineHeight: '28px',
}));

export const TitleIcon = styled(FontAwesomeIcon)(
  ({ theme: { accentColor, mq } }) => ({
    color: accentColor,
    marginBottom: '12px',
    fontSize: '38px',

    [mq('tabletUp')]: {
      fontSize: '42px',
    },
  })
);

export const Image = styled.img(({ theme: { mq } }) => ({
  boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.1)',
  maxWidth: '100%',

  [mq('tabletUp')]: {
    marginLeft: '30px',
    marginRight: '30px',
    maxWidth: 'calc(100% - 60px)',
  },
}));
