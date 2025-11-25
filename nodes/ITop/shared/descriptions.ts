import type { INodeProperties } from 'n8n-workflow';

export const classNameField: INodeProperties = {
	displayName: 'Class',
	name: 'class',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. Person, UserRequest, Server',
	description: 'The iTop object class to work with',
};

export const keyField: INodeProperties = {
	displayName: 'Key',
	name: 'key',
	type: 'string',
	default: '',
	required: true,
	placeholder: 'e.g. 123 or SELECT Person WHERE email = "user@example.com"',
	description: 'Object identifier: numeric ID, OQL query, or JSON search criteria',
};

export const outputFieldsField: INodeProperties = {
	displayName: 'Output Fields',
	name: 'output_fields',
	type: 'string',
	default: '*',
	placeholder: 'e.g. friendlyname, email, status or * for all fields',
	description: 'Comma-separated list of fields to return. Use "*" for all fields or "*+" for all fields including subclass attributes.',
};

export const limitField: INodeProperties = {
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 0,
	description: 'Maximum number of results to return. 0 means no limit.',
	typeOptions: {
		minValue: 0,
	},
};

export const commentField: INodeProperties = {
	displayName: 'Comment',
	name: 'comment',
	type: 'string',
	default: '',
	placeholder: 'e.g. Updated via n8n workflow',
	description: 'Optional comment to attach to the operation for audit purposes',
};
