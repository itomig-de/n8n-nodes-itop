import type { INodeProperties } from 'n8n-workflow';
import { classNameField, keyField, outputFieldsField, limitField } from '../shared/descriptions';

export const getFields: INodeProperties[] = [
	{
		...classNameField,
		displayOptions: {
			show: {
				operation: ['get'],
			},
		},
	},
	{
		...keyField,
		displayOptions: {
			show: {
				operation: ['get'],
			},
		},
	},
	{
		...outputFieldsField,
		displayOptions: {
			show: {
				operation: ['get'],
			},
		},
	},
	{
		...limitField,
		displayOptions: {
			show: {
				operation: ['get'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 0,
				description: 'Page number for pagination (0-based)',
				typeOptions: {
					minValue: 0,
				},
			},
		],
	},
];
