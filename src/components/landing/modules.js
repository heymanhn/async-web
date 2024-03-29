import Headline from './modules/Headline';
import LargeGraphic from './modules/LargeGraphic';
import SideGraphic from './modules/SideGraphic';
import Reasons from './modules/Reasons';
import EmailCapture from './modules/EmailCapture';

export const HEADLINE = 'headline';
export const LARGE_GRAPHIC = 'large-graphic';
export const SIDE_GRAPHIC = 'side-graphic';
export const REASONS = 'reasons';
export const EMAIL_CAPTURE = 'email-capture';

export const modules = {};
modules[HEADLINE] = Headline;
modules[LARGE_GRAPHIC] = LargeGraphic;
modules[SIDE_GRAPHIC] = SideGraphic;
modules[REASONS] = Reasons;
modules[EMAIL_CAPTURE] = EmailCapture;
