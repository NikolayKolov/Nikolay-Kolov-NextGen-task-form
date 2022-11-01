import { post } from './axiosConfig';

const configs = require('./apiConfig.json');

export const validateRegistrationForm = (data: FormData, options: any = undefined) => {
	let validateFormURL = configs.endPoints.registrationValidationURL;
	return post(validateFormURL, data, options);
};
