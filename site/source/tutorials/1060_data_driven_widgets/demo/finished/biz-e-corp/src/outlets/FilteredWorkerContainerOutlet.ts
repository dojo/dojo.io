import { Outlet } from '@dojo/routing/Outlet';

import WorkerContainer from './../widgets/WorkerContainer';

export const FilteredWorkerContainerOutlet = Outlet({ index: WorkerContainer }, 'filter', { mapParams: ({ params }) => {
	return { filter: params.filter };
}});

export default FilteredWorkerContainerOutlet;
