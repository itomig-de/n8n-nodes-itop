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

export class ITop implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'iTop',
		name: 'iTop',
			icon: {
				light: 'file:icons/itop.svg',
				dark: 'file:icons/itop-dark.svg',
			},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with iTop CMDB via REST API',
		usableAsTool: true,
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
						action: 'Get objects',
						description: 'Search for and retrieve iTop objects',
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update an object',
						description: 'Update a single iTop object',
					},
				],
				default: 'get',
			},
			...getFields,
			...updateFields,
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
					const formattedItems = formatITopResponse(response, i);
					returnData.push(...formattedItems);

				} else if (operation === 'update') {
					const className = this.getNodeParameter('class', i) as string;
					const key = this.getNodeParameter('key', i) as string;
					const fieldsToUpdate = this.getNodeParameter('fields', i) as IDataObject;
					const outputFields = this.getNodeParameter('output_fields', i) as string;
					const comment = this.getNodeParameter('comment', i, '') as string;
					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

					// Convert fixedCollection format to simple object
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
					const formattedItems = formatITopResponse(response, i);
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
