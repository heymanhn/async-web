/*
 * Returns an optimal letter spacing given a font size. Used with the Inter font.
 *
 * Borrowed from https://gist.github.com/daliborgogic/411365e0e17710922bb45c7164a356f3
 */

import { roundToPrecision } from 'utils/helpers';

// Constants provided by https://rsms.me/inter/dynmetrics/
const A = -0.0223;
const B = 0.185;
const C = -0.1745;

const LINE_HEIGHTS = {
  content: 1.6,
  title: 1.2,
};

// Produces the line height for the given font size
const lineHeight = (fontSize, type = 'content') =>
  Math.round(fontSize * LINE_HEIGHTS[type]);

/* Takes the font size in points or pixels and returns the compensating tracking
 * in EM units.
 *
 * tracking = a + b * e ^ (c * fontSize)
 */
const letterSpacing = fontSize =>
  roundToPrecision(A + B * Math.E ** (C * fontSize), 3);

export { letterSpacing, lineHeight };
