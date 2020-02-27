import largeGraphic from 'images/roval-screenshot-1.png';
import { HEADLINE, LARGE_GRAPHIC } from './modules';

const DEFAULT_PROPERTIES = {
  mode: 'light',
};

const moduleList = [
  {
    type: HEADLINE,
    content: {
      title: 'All your discussions, in one place.',
      description:
        'Roval is an app that does something great. Everyone should use it. The description might exceed one line. That’s fine.',
    },
  },
  {
    type: LARGE_GRAPHIC,
    mode: 'dark',
    content: {
      title: 'Super Feature One',
      description:
        'This feature kicks the competition out of the park. Once you use it, you won’t be able to turn back. We guarantee.',
      image: largeGraphic,
    },
  },
  // {
  //   type: REASONS,
  //   mode: 'dark',
  //   content: {
  //     title: 'Super Feature One',
  //     description:
  //       'This feature kicks the competition out of the park. Once you use it, you won’t be able to turn back. We guarantee.',
  //     imageUrl: 'images/roval-screenshot-1.png',
  //   },
  // },
];

export default moduleList.map(m => ({ ...DEFAULT_PROPERTIES, ...m }));
