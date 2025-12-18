import type { INodeProperties } from 'n8n-workflow';
import { classNameField, keyField, outputFieldsField, commentField } from '../shared/descriptions';

export const applyStimulusFields: INodeProperties[] = [
	{
		...classNameField,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['apply_stimulus'],
			},
		},
	},
	{
		...keyField,
		description: 'Object identifier: numeric ID or search criteria. Must uniquely identify one object.',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['apply_stimulus'],
			},
		},
	},
	{
		displayName: 'Stimulus',
		name: 'stimulus',
		type: 'string',
		default: '',
		required: true,
		description: 'The stimulus to apply (e.g. ev_assign)',
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['apply_stimulus'],
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
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['apply_stimulus'],
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
						placeholder: 'e.g. agent_id, team_id',
						description: 'Name of the field to update before applying the stimulus',
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
				resource: ['object'],
				operation: ['apply_stimulus'],
			},
		},
	},
	{
		...commentField,
		displayOptions: {
			show: {
				resource: ['object'],
				operation: ['apply_stimulus'],
			},
		},
	},
];
