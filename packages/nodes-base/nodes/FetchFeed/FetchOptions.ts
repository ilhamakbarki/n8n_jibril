import {
	INodeProperties,
} from 'n8n-workflow';

export const FetchOptions = [
	/* -------------------------------------------------------------------------- */
	/*                           spaces:Options Fields                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: [
					'fetch_data',
					'fetch_company',
					'fetch_all_data',
					'fetch_all_data_by_id',
				],
			},
		},
		options: [
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 0,
				placeholder: "0",
				description: 'Page',
			},
			{
				displayName: 'Limit Per Page',
				name: 'limit_page',
				type: 'number',
				default: 25,
				placeholder: "25",
				description: 'Limit Data Perpage',
			},
			{
				displayName: 'All Page',
				name: 'all_page',
				type: 'boolean',
				default: false,
				description: 'All Page',
			},
			{
				displayName: 'Organization ID',
				name: 'organization_id',
				type: 'string',
				default: '',
				description: 'Organization ID',
			},
			{
				displayName: 'Start Time',
				name: 'start_time',
				type: 'number',
				default: '',
				description: 'Start time with format Epoch'
			},
			{
				displayName: 'End Time',
				name: 'end_time',
				type: 'number',
				default: '',
				description: 'End time with format Epoch'
			},
			{
				displayName: 'Locations',
				name: 'locations',
				type: 'string',
				default: '',
				description: 'Searchable Locations, separator pipe(|) for many locations'
			},
		],
	}
] as INodeProperties[];
