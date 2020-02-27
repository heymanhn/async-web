import largeGraphic from 'images/roval-screenshot-1.png';
import sideGraphic from 'images/roval-screenshot-2.png';
import { HEADLINE, LARGE_GRAPHIC, SIDE_GRAPHIC } from './modules';

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
      icon: 'comments-alt',
      title: 'Super Feature One',
      description:
        'This feature kicks the competition out of the park. Once you use it, you won’t be able to turn back. We guarantee.',
      image: largeGraphic,
    },
  },
  {
    type: SIDE_GRAPHIC,
    side: 'right',
    content: {
      icon: 'file-alt',
      title: 'Super Feature Two',
      description:
        'Take a look at this beautiful screenshot of the product. We’re describing how it works right here.',
      image: sideGraphic,
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
