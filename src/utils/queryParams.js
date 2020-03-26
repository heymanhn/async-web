/* eslint camelcase:0 */

import queryString from 'query-string';
import camelCase from 'camelcase';
import snake_case from 'snake-case';

export const parseQueryString = fragment => {
  const queryParams = queryString.parse(fragment);
  Object.keys(queryParams).forEach(k => {
    const camelKey = camelCase(k);
    if (camelKey !== k) {
      queryParams[`${camelKey}`] = queryParams[k];
      delete queryParams[k];
    }
  });
  return queryParams;
};

export const createQueryString = params => {
  if (!Object.keys(params).length) return '';

  const queryParams = params;
  Object.keys(queryParams).forEach(k => {
    const snake_key = snake_case(k);
    if (snake_key !== k) {
      queryParams[`${snake_key}`] = queryParams[k];
      delete queryParams[k];
    }
  });

  const qString = Object.keys(queryParams)
    .map(k => `${k}=${queryParams[k]}`)
    .join('&');

  return `?${qString}`;
};

export const snakedQueryParams = params => {
  if (!Object.keys(params).length) return '';

  const queryParams = params;
  Object.keys(queryParams).forEach(k => {
    const snake_key = snake_case(k);
    if (snake_key !== k) {
      queryParams[`${snake_key}`] = queryParams[k];
      delete queryParams[k];
    }
  });

  return queryParams;
};
