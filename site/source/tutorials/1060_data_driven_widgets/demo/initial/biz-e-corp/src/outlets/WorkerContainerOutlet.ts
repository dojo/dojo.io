import { Outlet } from '@dojo/routing/Outlet';

import WorkerContainer from './../widgets/WorkerContainer';

export const WorkerContainerOutlet = Outlet({ index: WorkerContainer }, 'directory');

export default WorkerContainerOutlet;
