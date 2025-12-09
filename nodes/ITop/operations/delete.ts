import type { INodeProperties } from 'n8n-workflow';
import { classNameField, keyField, commentField } from '../shared/descriptions';

export const deleteFields: INodeProperties[] = [
	{
		...classNameField,
		displayOptions: {
			show: {
				operation: ['delete'],
			},
		},
	},
	{
		...keyField,
		description: 'The key or ID of the object to delete. Must uniquely identify one object.',
		displayOptions: {
			show: {
				operation: ['delete'],
			},
		},
	},
	{
		...commentField,
		displayOptions: {
			show: {
				operation: ['delete'],
			},
		},
	},
];
