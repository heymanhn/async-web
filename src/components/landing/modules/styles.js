import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';

export const LargeTitle = styled.div(
  ({ theme: { fontProps, mq, textColors } }) => ({
    ...fontProps({ size: 48, weight: 700, type: 'title' }),

    color: textColors.main,
    margin: '0 auto 20px',

    [mq('tabletUp')]: {
      ...fontProps({ size: 52, type: 'title' }),
      maxWidth: '680px',
      textAlign: 'center',
    },
  })
);

export const LargeDescription = styled.div(
  ({ theme: { fontProps, mq, textColors } }) => ({
    ...fontProps({ size: 20 }),

    color: textColors.alt,
    margin: '0 auto 30px',

    [mq('tabletUp')]: {
      maxWidth: '600px',
      textAlign: 'center',
    },
  })
);

export const SmallTitle = styled.div(
  ({ theme: { fontProps, mq, textColors } }) => ({
    ...fontProps({ size: 32, weight: 700, type: 'title' }),
    color: textColors.main,
    marginBottom: '10px',

    [mq('tabletUp')]: fontProps({ size: 36, type: 'title' }),
  })
);

// Not specifying a letter-spacing for this one. It looks too compressed
// with the recommended value.
export const SmallDescription = styled.div(
  ({ theme: { fontProps, textColors } }) => ({
    ...fontProps({ size: 18 }),
    color: textColors.alt,
  })
);

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
