<template>
	<div class="row">
        <div class="col-md-12" id="sign-contract"></div>

    <div class="col-md-12">
        <button type="button" class="btn btn-primary" title="Does this contract put me at risk legally?" @click="prompt('Does this contract put me at risk legally?')">Asses Legal Risk</button>
        <button type="button" class="btn btn-primary" title="Does this contract provide any warranty?" @click="prompt('Does this contract provide any warranty?')">Asses Warranty Info</button>
        <button type="button" class="btn btn-primary" title="Does this contract cover liability and will I be liable for injuries or property damage?" @click="prompt('Does this contract cover liability and will I be liable for injuries or property damage?')">Asses Liability Info</button>
        <button type="button" class="btn btn-primary" title="Does this contract address issues regarding timing and budget overages?" @click="prompt('Does this contract address issues regarding timing and budget overages?')">Asses Time and Budget Info</button>
    </div>
	<div class="col-md-12" style="white-space: pre-wrap;" v-text="promptResult">
	</div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

type Contract = {
	id: string;
	signatureUrl: string;
};

type PromptResponse = {
    response: string;
};

const contractId = ref("");
const promptResult = ref("");

onMounted(async () => {
	const route = useRoute();
	const query = route.query;
	const id = query.contractId;
    contractId.value = id as string;

	const response = await fetch(`/api/contract/get/${contractId.value}`, {
		method: 'get'
	});

	if (response.status == 200) {
		const contract = (await response.json()) as Contract;
		const client = new window.HelloSign({
			clientId: 'bc9a07dcff8d15eec6ebfe0061dbc9a8'
		});

		client.open(contract.signatureUrl, {
			skipDomainVerification: true, 
            container: document.getElementById('sign-contract')
		});
	}
});

async function prompt(prompt: string) {
    const request = {
        contractId: contractId.value,
        prompt: prompt
    }

    const response = await fetch(`/api/contract/prompt`, {
		method: 'post',
        headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	});

    if (response.status == 200) {
        const promptResponse = await response.json() as PromptResponse;
		promptResult.value = promptResponse.response;
    }
}
</script>

<style scoped></style>
