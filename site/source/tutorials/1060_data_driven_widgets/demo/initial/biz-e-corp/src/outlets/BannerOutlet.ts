import { Outlet } from '@dojo/framework/routing/Outlet';

import Banner from './../widgets/Banner';

export const BannerOutlet = Outlet({ index: Banner }, 'home');

export default BannerOutlet;
