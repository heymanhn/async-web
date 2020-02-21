export const isDiscussionOpen = id => {
  const { href } = window.location;
  return href.includes(id);
};

// Neat trick to support modular arithmetic for negative numbers
// https://dev.to/maurobringolf/a-neat-trick-to-compute-modulo-of-negative-numbers-111e
export const mod = (x, n) => ((x % n) + n) % n;
