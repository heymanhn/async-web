/* eslint react/no-array-index-key: 0 */
import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import styled from '@emotion/styled';

import NavBar from './NavBar';
import contents from './content';
import { modules } from './modules';
import themes from './themes';

const Footer = styled.div(({ theme: { bgColors, colors, fontProps } }) => ({
  ...fontProps({ size: 14 }),

  background: bgColors.main,
  color: colors.grey4,
  padding: '0 30px 30px',
  textAlign: 'center',
}));

const LandingPage = () => {
  if (!contents.length)
    throw new Error('No modules specified for landing page');

  const { mode: firstMode } = contents[0];
  const { mode: lastMode } = contents[contents.length - 1];

  const contentsWithModules = contents.map(c => ({
    ...c,
    Module: modules[c.type],
  }));

  return (
    <>
      <ThemeProvider theme={themes[firstMode]}>
        <NavBar />
      </ThemeProvider>
      {contentsWithModules.map(({ Module, content, ...fwdProps }, i) => (
        <ThemeProvider key={i} theme={themes[fwdProps.mode]}>
          <Module {...content} {...fwdProps} />
        </ThemeProvider>
      ))}
      <ThemeProvider theme={themes[lastMode]}>
        <Footer mode={lastMode}>(c) Finos, Inc.</Footer>
      </ThemeProvider>
    </>
  );
};

export default LandingPage;
