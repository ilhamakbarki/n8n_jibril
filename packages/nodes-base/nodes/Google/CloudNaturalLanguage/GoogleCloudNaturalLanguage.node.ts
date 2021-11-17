
import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	IData, IDocument, IPayload, TextSnippet
} from './Interface';

import {
	googleApiRequest,
} from './GenericFunctions';

export class GoogleCloudNaturalLanguage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Google Cloud Natural Language',
		name: 'googleCloudNaturalLanguage',
		icon: 'file:googlecloudnaturallanguage.png',
		group: ['input', 'output'],
		version: 1,
		description: 'Consume Google Cloud Natural Language API',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		defaults: {
			name: 'Google Cloud Natural Language',
			color: '#5288f0',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'googleCloudNaturalLanguageOAuth2Api',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'Document',
						value: 'document',
					},
				],
				default: 'document',
				description: 'The resource to operate on.',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: [
							'document',
						],
					},
				},
				options: [
					{
						name: 'Analyze Sentiment',
						value: 'analyzeSentiment',
						description: 'Analyze Sentiment',
					},
					{
						name: 'Classify Text',
						value: 'classifyText',
						description: 'Classifies a document into categories',
					},
				],
				default: 'analyzeSentiment',
				description: 'The operation to perform',
			},
			// ----------------------------------
			//         All
			// ----------------------------------
			{
				displayName: 'Source',
				name: 'source',
				type: 'options',
				options: [
					{
						name: 'Content',
						value: 'content',
					},
					{
						name: 'Google Cloud Storage URI',
						value: 'gcsContentUri',
					},
				],
				default: 'content',
				description: 'The source of the document: a string containing the content or a Google Cloud Storage URI.',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'analyzeSentiment',
							'classifyText',
						],
					},
				},
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				description: 'The content of the input in string format. Cloud audit logging exempt since it is based on user data. ',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'analyzeSentiment',
							'classifyText',
						],
						source: [
							'content',
						],
					},
				},
			},
			{
				displayName: 'Google Cloud Storage URI',
				name: 'gcsContentUri',
				type: 'string',
				default: '',
				description: 'The Google Cloud Storage URI where the file content is located. This URI must be of the form: gs://bucket_name/object_name.<br/> For more details, see https://cloud.google.com/storage/docs/reference-uris.',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'analyzeSentiment',
							'classifyText'
						],
						source: [
							'gcsContentUri'
						]
					},
				},
			},
			{
				displayName: 'Model ID',
				name: 'modelId',
				type: 'string',
				default: '',
				description: 'Model Id',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'classifyText',
						],
					},
				},
			},
			{
				displayName: 'Project',
				name: 'project',
				type: 'string',
				default: '',
				description: 'Project ID',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'classifyText',
						],
					},
				},
			},
			{
				displayName: 'Server Location',
				name: 'server',
				type: 'string',
				default: '',
				description: 'Server Location',
				required: true,
				displayOptions: {
					show: {
						operation: [
							'classifyText',
						],
					},
				},
			},
			{
				displayName: 'Show Only Highest',
				name: 'onlyHighest',
				type: 'boolean',
				default: false,
				description: 'Reponse Only Hight.',
				displayOptions: {
					show: {
						operation: [
							'classifyText',
						],
					},
				},
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				displayOptions: {
					show: {
						operation: [
							'analyzeSentiment',
							'classifyText',
						],
					},
				},
				default: {},
				description: '',
				placeholder: 'Add Option',
				options: [
					{
						displayName: 'Document Type',
						name: 'documentType',
						type: 'options',
						options: [
							{
								name: 'HTML',
								value: 'HTML',
							},
							{
								name: 'Plain Text',
								value: 'PLAIN_TEXT',
							},
						],
						default: 'PLAIN_TEXT',
						description: 'The type of input document.',
						required: true,
					},
					{
						displayName: 'Encoding Type',
						name: 'encodingType',
						type: 'options',
						options: [
							{
								name: 'None',
								value: 'NONE',
							},
							{
								name: 'UTF-8',
								value: 'UTF8',
							},
							{
								name: 'UTF-16',
								value: 'UTF16',
							},
							{
								name: 'UTF-32',
								value: 'UTF32',
							},
						],
						default: 'UTF16',
						description: 'The encoding type used by the API to calculate sentence offsets.',
					},
					{
						displayName: 'Language',
						name: 'language',
						type: 'options',
						options: [
							{
								name: 'Arabic',
								value: 'ar',
							},
							{
								name: 'Chinese (Simplified)	',
								value: 'zh',
							},
							{
								name: 'Chinese (Traditional)',
								value: 'zh-Hant',
							},
							{
								name: 'Dutch',
								value: 'nl',
							},
							{
								name: 'English',
								value: 'en',
							},
							{
								name: 'French',
								value: 'fr',
							},
							{
								name: 'German',
								value: 'de',
							},
							{
								name: 'Indonesian',
								value: 'id',
							},
							{
								name: 'Italian',
								value: 'it',
							},
							{
								name: 'Japanese',
								value: 'ja',
							},
							{
								name: 'Korean',
								value: 'ko',
							},
							{
								name: 'Portuguese (Brazilian & Continental)',
								value: 'pt',
							},
							{
								name: 'Spanish',
								value: 'es',
							},
							{
								name: 'Thai',
								value: 'th',
							},
							{
								name: 'Turkish',
								value: 'tr',
							},
							{
								name: 'Vietnamese',
								value: 'vi',
							},
						],
						default: 'en',
						placeholder: '',
						description: 'The language of the document (if not specified, the language is automatically detected). Both ISO and BCP-47 language codes are accepted.',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const length = items.length as unknown as number;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const responseData = [];
		for (let i = 0; i < length; i++) {
			if (resource === 'document') {
				const source = this.getNodeParameter('source', i) as string;
				const options = this.getNodeParameter('options', i) as IDataObject;
				const documentType = (options.documentType as string | undefined) || 'PLAIN_TEXT';

				if (operation === 'analyzeSentiment') {
					const body: IData = {
						document: {
							type: documentType,
						}
					};

					if (source === 'content') {
						body.document.content = this.getNodeParameter('content', i) as string
					} else {
						body.document.gcsContentUri = this.getNodeParameter('gcsContentUri', i) as string
					}

					if (options.language) {
						body.document.language = options.language as string;
					}

					const encodingType = (options.encodingType as string | undefined) || 'UTF16';
					body.encodingType = encodingType
					const response = await googleApiRequest.call(this, 'POST', `/v1/documents:analyzeSentiment`, body);
					responseData.push(response);
				} else if (operation === 'classifyText') {
					const onlyHight = this.getNodeParameter('onlyHighest', i) as boolean || false;
					const modelId = this.getNodeParameter('modelId', i) as string;
					const body: IPayload = {}
					const documentType = (options.documentType as string | undefined) || 'text/plain';

					if (source === 'content') {
						const content = this.getNodeParameter('content', i) as string
						const textSnippet: TextSnippet = {
							mime_type: documentType,
							content: content
						}
						body.textSnippet = textSnippet;
					} else {
						const document: IDocument = {}
						document.input_config = {
							"gcs_source": {
								"input_uris": this.getNodeParameter('gcsContentUri', i) as string
							}
						}
						body.document = document
					}
					const project = this.getNodeParameter('project', i) as string
					const server = this.getNodeParameter('server', i) as string
					let url = `https://automl.googleapis.com/v1/projects/${project}/${server}/models/${modelId}:predict`
					let response = await googleApiRequest.call(this, 'POST', ``, body, {}, url);
					response = response.categories
					if (onlyHight) {
						let scoreHigh = 0, name = ""
						response.forEach((r: any) => {
							if (scoreHigh < r.confidence) {
								name = r.name
								scoreHigh = r.confidence
							}
						});
						responseData.push({
							name: name,
							confidence: scoreHigh
						});
					} else {
						responseData.push(response);
					}
				}
			}
		}
		return [this.helpers.returnJsonArray(responseData)];
	}
}
