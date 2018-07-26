import { Outlet } from '@dojo/framework/routing/Outlet';

import WorkerForm from './../widgets/WorkerForm';

export const WorkerFormOutlet = Outlet(WorkerForm, 'new-worker');

export default WorkerFormOutlet;
