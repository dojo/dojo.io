import { Container } from '@dojo/widget-core/Container';

import ApplicationContext from './../ApplicationContext';
import WorkerForm, { WorkerFormProperties } from './../widgets/WorkerForm';

function getProperties(inject: ApplicationContext, properties: any) {
	const { formData, formInput: onFormInput, submitForm: onFormSave } = inject;

	return { formData, onFormInput: onFormInput.bind(inject), onFormSave: onFormSave.bind(inject) };
}

const WorkerFormContainer = Container(WorkerForm, 'app-state', { getProperties });

export default WorkerFormContainer;
