import { Container } from '@dojo/widget-core/Container';

import ApplicationContext from './../ApplicationContext';
import WorkerContainer, { WorkerContainerProperties } from './../widgets/WorkerContainer';

function getProperties(inject: ApplicationContext, properties: any) {
	return { workerData: inject.workerData };
}

const WorkerContainerContainer = Container(WorkerContainer, 'app-state', { getProperties });

export default WorkerContainerContainer;
