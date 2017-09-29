import { Outlet } from '@dojo/routing/Outlet';

import WorkerContainer from './../widgets/WorkerContainer';

export const FilteredWorkerContainerOutlet = Outlet({ index: WorkerContainer }, 'filter', (options) => {
	return { filter: options.params.filter };
});

export default FilteredWorkerContainerOutlet;
