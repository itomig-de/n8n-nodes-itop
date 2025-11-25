import type { INodeProperties } from 'n8n-workflow';
import { classNameField, outputFieldsField, commentField } from '../shared/descriptions';

export const createFields: INodeProperties[] = [
	{
		...classNameField,
		displayOptions: {
			show: {
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Fields',
		name: 'fields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Field',
		default: {},
		required: true,
		displayOptions: {
			show: {
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'e.g. name, org_id, description',
						description: 'Name of the field to set when creating the object',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value to assign to the field',
					},
				],
			},
		],
	},
	{
		...outputFieldsField,
		displayOptions: {
			show: {
				operation: ['create'],
			},
		},
	},
	{
		...commentField,
		displayOptions: {
			show: {
				operation: ['create'],
			},
		},
	},
];
