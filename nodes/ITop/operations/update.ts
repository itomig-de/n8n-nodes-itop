import type { INodeProperties } from 'n8n-workflow';
import { classNameField, keyField, outputFieldsField, commentField } from '../shared/descriptions';

export const updateFields: INodeProperties[] = [
	{
		...classNameField,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['update'],
			},
		},
	},
	{
		...keyField,
		description: 'Object identifier: numeric ID or search criteria. Note: Key must identify exactly ONE object, bulk updates are not supported.',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['update'],
			},
		},
	},
	{
		displayName: 'Fields to Update',
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
				resource: ['object'],
				operation: ['update'],
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
						placeholder: 'e.g. status, team_id, description',
						description: 'The name of the field to update',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'The new value for the field',
					},
				],
			},
		],
	},
	{
		...outputFieldsField,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['update'],
			},
		},
	},
	{
		...commentField,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['update'],
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
				resource: ['object'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Simulation Mode',
				name: 'simulate',
				type: 'boolean',
				default: false,
				description: 'Whether to simulate the update without actually modifying the object',
			},
		],
	},
];
