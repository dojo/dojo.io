import { Outlet } from '@dojo/routing/Outlet';

import Banner from './../widgets/Banner';

export const BannerOutlet = Outlet({ index: Banner }, 'home');

export default BannerOutlet;
