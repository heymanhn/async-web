/* eslint import/prefer-default-export: 0 */
import styled from '@emotion/styled';
import dashedBorder from 'assets/icons/dashed-border.png';

export const MeetingSpaceBanner = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `dashed 1px ${colors.grey6}`,
  borderImage: `url(${dashedBorder}) 1 / 1px round`,
  width: '100%',
}));

export const OnboardingInputField = styled.input(({ theme: { colors } }) => ({
  border: `1px solid ${colors.borderGrey}`,
  borderRadius: '5px',
  color: colors.mainText,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '22px',
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
}));
