/* eslint import/prefer-default-export: 0 */
import styled from '@emotion/styled';
import dashedBorder from 'assets/icons/dashed-border.png';

export const MeetingSpaceBanner = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `dashed 1px ${colors.grey6}`,
  borderImage: `url(${dashedBorder}) 1 / 1px round`,
  width: '100%',
}));

export const OnboardingInputField = styled.input(
  ({ theme: { colors, fontProps } }) => ({
    ...fontProps({ size: 14, weight: 400 }),

    border: `1px solid ${colors.borderGrey}`,
    borderRadius: '5px',
    color: colors.mainText,
    marginBottom: '25px',
    padding: '8px 12px',
    width: '300px',

    '::placeholder': {
      color: colors.textPlaceholder,
    },

    ':focus': {
      outline: 'none',
      border: `1px solid ${colors.grey4}`,
    },
  })
);

// Pure CSS solution for truncating a single line of text
// Useful on elements that are flexbox children
//
// https://css-tricks.com/flexbox-truncated-text/
export const TruncatedSingleLine = styled.div({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
