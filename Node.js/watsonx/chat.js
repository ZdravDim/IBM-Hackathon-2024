export const chatBody = {
	parameters: {
		decoding_method: "greedy",
		max_new_tokens: 200,
		min_new_tokens: 0,
		stop_sequences: [],
		repetition_penalty: 1
	},
	moderations: {
		hap: {
			input: {
				enabled: true,
				threshold: 0.5,
				mask: {
					remove_entity_value: true
				}
			},
			output: {
				enabled: true,
				threshold: 0.5,
				mask: {
					remove_entity_value: true
				}
			}
		}
	}
};