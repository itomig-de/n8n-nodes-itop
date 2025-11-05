import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IDataObject,
} from 'n8n-workflow';
import { getFields } from './operations/get';
import { updateFields } from './operations/update';
import { iTopApiRequest, formatITopResponse } from './shared/transport';
import { createFields } from './operations/create';
import { deleteFields } from './operations/delete';
import { applyStimulusFields, applyStimulusOperation } from './operations/apply_stimulus';


export class ITop implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'iTop',
		name: 'iTop',
		icon: 'file:itop.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with iTop CMDB via REST API',
		defaults: {
			name: 'iTop',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'iTopApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['credentials'],
					},
				},
			},
			{
				name: 'iTopTokenApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['token'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Username and Password',
						value: 'credentials',
					},
					{
						name: 'Token',
						value: 'token',
					},
				],
				default: 'credentials',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get objects from iTop',
						description: 'Search for and retrieve iTop objects',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update an iTop object',
						description: 'Update a single iTop object',
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create a new iTop object',
						description: 'Create a new object in iTop',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete an iTop object',
						description: 'Delete an existing object in iTop',
					},
					{
						name: 'Apply Stimulus',
						value: 'apply_stimulus',
						action: 'Update an object and apply a stimulus to change its state',
						description: 'Update fields and apply a stimulus on a single iTop object',
					},
				],
				default: 'get',
			},
			...getFields,
			...updateFields,
			...createFields,
			...deleteFields,
			...applyStimulusFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				if (operation === 'get') {
					const className = this.getNodeParameter('class', i) as string;
					const key = this.getNodeParameter('key', i) as string;
					const outputFields = this.getNodeParameter('output_fields', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

					const requestData: IDataObject = {
						class: className,
						key,
						output_fields: outputFields,
					};

					if (limit > 0) {
						requestData.limit = limit;
					}

					if (additionalOptions.page !== undefined) {
						requestData.page = additionalOptions.page;
					}

					const response = await iTopApiRequest.call(this, 'core/get', requestData);
					const formattedItems = formatITopResponse(response);
					returnData.push(...formattedItems);

				} else if (operation === 'update') {
					const className = this.getNodeParameter('class', i) as string;
					const key = this.getNodeParameter('key', i) as string;
					const fieldsToUpdate = this.getNodeParameter('fields', i) as IDataObject;
					const outputFields = this.getNodeParameter('output_fields', i) as string;
					const comment = this.getNodeParameter('comment', i, '') as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

					const fields: IDataObject = {};
					if (fieldsToUpdate.field && Array.isArray(fieldsToUpdate.field)) {
						for (const field of fieldsToUpdate.field) {
							const fieldData = field as IDataObject;
							if (fieldData.name && fieldData.value !== undefined) {
								fields[fieldData.name as string] = fieldData.value;
							}
						}
					}

					const requestData: IDataObject = {
						class: className,
						key,
						fields,
						output_fields: outputFields,
					};

					if (comment) {
						requestData.comment = comment;
					}

					if (additionalOptions.simulate) {
						requestData.simulate = true;
					}

					const response = await iTopApiRequest.call(this, 'core/update', requestData);
					const formattedItems = formatITopResponse(response);
					returnData.push(...formattedItems);

				} else if (operation === 'create') {
					const className = this.getNodeParameter('class', i) as string;
					const fieldsToCreate = this.getNodeParameter('fields', i) as IDataObject;
					const outputFields = this.getNodeParameter('output_fields', i) as string;
					const comment = this.getNodeParameter('comment', i, '') as string;

					const fields: IDataObject = {};
					if (fieldsToCreate.field && Array.isArray(fieldsToCreate.field)) {
						for (const field of fieldsToCreate.field) {
							const fieldData = field as IDataObject;
							if (fieldData.name && fieldData.value !== undefined) {
								fields[fieldData.name as string] = fieldData.value;
							}
						}
					}

					const requestData: IDataObject = {
						class: className,
						fields,
						output_fields: outputFields,
					};

					if (comment) {
						requestData.comment = comment;
					}

					const response = await iTopApiRequest.call(this, 'core/create', requestData);
					const formattedItems = formatITopResponse(response);
					returnData.push(...formattedItems);

				} else if (operation === 'delete') {
					const className = this.getNodeParameter('class', i) as string;
					const key = this.getNodeParameter('key', i) as string;
					const comment = this.getNodeParameter('comment', i, '') as string;

					const requestData: IDataObject = {
						class: className,
						key,
					};

					if (comment) {
						requestData.comment = comment;
					}

					const response = await iTopApiRequest.call(this, 'core/delete', requestData);
					const formattedItems = formatITopResponse(response);
					returnData.push(...formattedItems);

				} else if (operation === 'apply_stimulus') {
					const className = this.getNodeParameter('class', i) as string;
					const key = this.getNodeParameter('key', i) as string;
					const stimulus = this.getNodeParameter('stimulus', i) as string;
					const fieldsToUpdate = this.getNodeParameter('fields', i) as IDataObject;
					const outputFields = this.getNodeParameter('output_fields', i) as string;
					const comment = this.getNodeParameter('comment', i, '') as string;

					const fields: IDataObject = {};
					if (fieldsToUpdate.field && Array.isArray(fieldsToUpdate.field)) {
						for (const field of fieldsToUpdate.field) {
							const fieldData = field as IDataObject;
							if (fieldData.name && fieldData.value !== undefined) {
								fields[fieldData.name as string] = fieldData.value;
							}
						}
					}

					const requestData: IDataObject = {
						class: className,
						key,
						stimulus,
						fields,
						output_fields: outputFields,
					};

					if (comment) {
						requestData.comment = comment;
					}

					const response = await iTopApiRequest.call(this, 'core/apply_stimulus', requestData);
					const formattedItems = formatITopResponse(response);
					returnData.push(...formattedItems);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
