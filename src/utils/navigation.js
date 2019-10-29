/* eslint import/prefer-default-export: 0 */

export function isDiscussionOpen(id) {
  const { href } = window.location;
  return href.includes(id);
}
