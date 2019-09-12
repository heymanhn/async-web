/* eslint import/prefer-default-export: 0 */
import styled from '@emotion/styled';
import dashedBorder from 'images/icons/dashed-border.png';

export const MeetingSpaceBanner = styled.div(({ theme: { colors } }) => ({
  background: colors.white,
  border: `dashed 1px ${colors.grey6}`,
  borderImage: `url(${dashedBorder}) 1 / 1px round`,
  width: '100%',
}));
