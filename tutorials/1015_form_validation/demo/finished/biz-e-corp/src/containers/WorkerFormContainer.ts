import { Container } from '@dojo/widget-core/Container';

import ApplicationContext from './../ApplicationContext';
import WorkerForm, { WorkerFormProperties } from './../widgets/WorkerForm';

function getProperties(inject: ApplicationContext, properties: any) {
	const { formData, formErrors, formInput: onFormInput, formValidate: onFormValidate, submitForm: onFormSave } = inject;

	return { formData, formErrors, onFormInput: onFormInput.bind(inject), onFormValidate: onFormValidate.bind(inject), onFormSave: onFormSave.bind(inject) };
}

const WorkerFormContainer = Container(WorkerForm, 'app-state', { getProperties });

export default WorkerFormContainer;
