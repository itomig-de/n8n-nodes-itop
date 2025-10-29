import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IDataObject,
	IHttpRequestOptions,
	INodeExecutionData,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function iTopApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	operation: string,
	additionalData: IDataObject = {},
): Promise<any> {
	// Determine which credential type to use based on authentication parameter
	const authentication = this.getNodeParameter('authentication', 0) as string;

	let credentials: IDataObject;
	if (authentication === 'token') {
		credentials = await this.getCredentials('iTopTokenApi');
	} else {
		credentials = await this.getCredentials('iTopApi');
	}

	const jsonData: IDataObject = {
		operation,
		...additionalData,
	};

	const body: IDataObject = {
		json_data: JSON.stringify(jsonData),
	};

	// Add authentication parameters to body
	if (authentication === 'token') {
		body.auth_token = credentials.authToken;
	} else {
		body.auth_user = credentials.username;
		body.auth_pwd = credentials.password;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body,
		url: `${credentials.url}/webservices/rest.php?version=${credentials.version}`,
		returnFullResponse: false,
	};

	try {
		const response = await this.helpers.httpRequest(options);

		// Check for iTop API errors
		if (response.code !== 0) {
			throw new NodeApiError(this.getNode(), {
				message: String(response.message || 'Unknown iTop API error'),
				description: `Error code: ${response.code}`,
			} as JsonObject);
		}

		return response;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Helper function to format iTop response objects into n8n items
 */
export function formatITopResponse(response: IDataObject): INodeExecutionData[] {
	const items: INodeExecutionData[] = [];

	if (response.objects) {
		const objects = response.objects as IDataObject;
		for (const objectKey of Object.keys(objects)) {
			const object = objects[objectKey] as IDataObject;
			const fields = object.fields as IDataObject;

			const jsonData: IDataObject = {
				_class: object.class,
				_key: object.key,
				_code: object.code,
				_message: object.message,
			};

			// Merge fields into jsonData if fields exists
			if (fields && typeof fields === 'object') {
				Object.assign(jsonData, fields);
			}

			items.push({
				json: jsonData,
				pairedItem: { item: 0 },
			});
		}
	}

	return items;
}
