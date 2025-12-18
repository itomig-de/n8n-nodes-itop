import {
	NodeConnectionTypes,
	type IExecuteFunctions,
	type INodeExecutionData,
	type INodeType,
	type INodeTypeDescription,
	type IDataObject,
	ApplicationError,
} from 'n8n-workflow';
import { getFields } from './operations/get';
import { updateFields } from './operations/update';
import { createFields } from './operations/create';
import { deleteFields } from './operations/delete';
import { applyStimulusFields } from './operations/apply_stimulus';
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
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Object',
						value: 'object',
					},
				],
				default: 'object',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['object'],
					},
				},
				options: [
					{
						name: 'Apply Stimulus',
						value: 'apply_stimulus',
						action: 'Apply stimulus to an object',
						description: 'Update fields and apply a stimulus on a single iTop object',
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create a new object',
						description: 'Create a new object in iTop',
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete an object',
						description: 'Delete an existing object in iTop',
					},
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
			...createFields,
			...deleteFields,
			...applyStimulusFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const operation = this.getNodeParameter('operation', 0) as string;
		const nodeInstance = new ITop();

		for (let i = 0; i < items.length; i++) {
			try {
				let operationResult: INodeExecutionData[];

				switch (operation) {
					case 'get':
						operationResult = await nodeInstance.handleGet(this, i);
						break;

					case 'update':
						operationResult = await nodeInstance.handleUpdate(this, i);
						break;

					case 'create':
						operationResult = await nodeInstance.handleCreate(this, i);
						break;

					case 'delete':
						operationResult = await nodeInstance.handleDelete(this, i);
						break;

					case 'apply_stimulus':
						operationResult = await nodeInstance.handleApplyStimulus(this, i);
						break;

					default:
						throw new ApplicationError(`Unknown operation: ${operation}`);
				}

				returnData.push(...operationResult);
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

	private toFieldMap(collection: IDataObject): IDataObject {
		const fields: IDataObject = {};
		if (collection && Array.isArray(collection.field)) {
			for (const entry of collection.field as IDataObject[]) {
				const fieldData = entry as IDataObject;
				if (fieldData.name && fieldData.value !== undefined) {
					fields[fieldData.name as string] = fieldData.value;
				}
			}
		}
		return fields;
	}

	private async handleGet(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const className = context.getNodeParameter('class', itemIndex) as string;
		const key = context.getNodeParameter('key', itemIndex) as string;
		const outputFields = context.getNodeParameter('output_fields', itemIndex) as string;
		const limit = context.getNodeParameter('limit', itemIndex) as number;
		const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as IDataObject;

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

		const response = await iTopApiRequest.call(context, 'core/get', requestData);
		return formatITopResponse(response, itemIndex);
	}

	private async handleUpdate(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const className = context.getNodeParameter('class', itemIndex) as string;
		const key = context.getNodeParameter('key', itemIndex) as string;
		const fieldsToUpdate = context.getNodeParameter('fields', itemIndex) as IDataObject;
		const outputFields = context.getNodeParameter('output_fields', itemIndex) as string;
		const comment = context.getNodeParameter('comment', itemIndex, '') as string;
		const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as IDataObject;

		const fields = this.toFieldMap(fieldsToUpdate);

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

		const response = await iTopApiRequest.call(context, 'core/update', requestData);
		return formatITopResponse(response, itemIndex);
	}

	private async handleCreate(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const className = context.getNodeParameter('class', itemIndex) as string;
		const fieldsToCreate = context.getNodeParameter('fields', itemIndex) as IDataObject;
		const outputFields = context.getNodeParameter('output_fields', itemIndex) as string;
		const comment = context.getNodeParameter('comment', itemIndex, '') as string;

		const fields = this.toFieldMap(fieldsToCreate);

		const requestData: IDataObject = {
			class: className,
			fields,
			output_fields: outputFields,
		};

		if (comment) {
			requestData.comment = comment;
		}

		const response = await iTopApiRequest.call(context, 'core/create', requestData);
		return formatITopResponse(response, itemIndex);
	}

	private async handleDelete(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const className = context.getNodeParameter('class', itemIndex) as string;
		const key = context.getNodeParameter('key', itemIndex) as string;
		const comment = context.getNodeParameter('comment', itemIndex, '') as string;

		const requestData: IDataObject = {
			class: className,
			key,
		};

		if (comment) {
			requestData.comment = comment;
		}

		const response = await iTopApiRequest.call(context, 'core/delete', requestData);
		return formatITopResponse(response, itemIndex);
	}

	private async handleApplyStimulus(
		context: IExecuteFunctions,
		itemIndex: number,
	): Promise<INodeExecutionData[]> {
		const className = context.getNodeParameter('class', itemIndex) as string;
		const key = context.getNodeParameter('key', itemIndex) as string;
		const stimulus = context.getNodeParameter('stimulus', itemIndex) as string;
		const fieldsToUpdate = context.getNodeParameter('fields', itemIndex) as IDataObject;
		const outputFields = context.getNodeParameter('output_fields', itemIndex) as string;
		const comment = context.getNodeParameter('comment', itemIndex, '') as string;

		const fields = this.toFieldMap(fieldsToUpdate);

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

		const response = await iTopApiRequest.call(context, 'core/apply_stimulus', requestData);
		return formatITopResponse(response, itemIndex);
	}
}
