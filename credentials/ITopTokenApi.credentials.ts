import type {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class ITopTokenApi implements ICredentialType {
	name = 'iTopTokenApi';

	displayName = 'iTop Token API';

	icon: Icon = {
		light: 'file:../nodes/ITop/icons/itop.svg',
		dark: 'file:../nodes/ITop/icons/itop-dark.svg',
	};

	documentationUrl = 'https://www.itophub.io/wiki/page?id=latest:advancedtopics:rest_json';

	properties: INodeProperties[] = [
		{
			displayName: 'iTop URL',
			name: 'url',
			type: 'string',
			default: '',
			placeholder: 'https://your-itop-instance.com',
			description: 'The base URL of your iTop instance (without /webservices/rest.php)',
			required: true,
		},
		{
			displayName: 'Auth Token',
			name: 'authToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Personal or application token from iTop',
		},
		{
			displayName: 'API Version',
			name: 'version',
			type: 'string',
			default: '1.3',
			description: 'The iTop REST API version to use',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.url}}/webservices/rest.php',
			url: '?version={{$credentials.version}}',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: {
				json_data: '={{ JSON.stringify({ operation: "list_operations" }) }}',
				auth_token: '={{$credentials.authToken}}',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'code',
					value: 1,
					message: 'Authentication failed. Missing/wrong credentials or the user does not have enough rights to perform the requested operation.',
				},
			},
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'code',
					value: 100,
					message: 'Request failed. Internal iTop Error.',
				},
			}
		],
	};
}
