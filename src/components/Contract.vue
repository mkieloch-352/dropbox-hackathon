<template>
	<div
		v-show="!templateCreated"
		ref="contractElement"
		class="col-md-12 generated-contract"
		v-text="contractText"
		contenteditable="true"
		style="white-space: pre-wrap"
	></div>
	<div class="col-md-12">
		<div class="form-group">
			<label for="title">Contract Title</label>
			<input type="text" class="form-control" id="title" v-model="title" placeholder="Sample Contract" />
		</div>
		<div class="form-group">
			<label for="title">Contract Subject</label>
			<input type="text" class="form-control" id="subject" v-model="subject" placeholder="Subject" />
		</div>
		<div class="form-group">
			<label for="title">Contract Message</label>
			<input type="text" class="form-control" id="message" v-model="message" placeholder="Message" />
		</div>
		<div class="form-group">
			<label for="title">Contract Roles</label>
			<input type="text" class="form-control" id="message" v-model="roles" placeholder="Client,Contractor" />
		</div>
		<button type="button" class="btn btn-primary" @click="generateTemplate" :disabled="templateCreated">Generate Document</button>
	</div>

	<div class="col-md-12" v-show="templateCreated">
        <div class="form-group">
			<label for="title">Requestor Name</label>
			<input type="text" class="form-control" id="name" v-model="requestorName" placeholder="Jon Smith" />
		</div>
		<div class="form-group">
			<label for="title">Requestor Email</label>
			<input type="email" class="form-control" id="email" v-model="requestorEmail" placeholder="jon@smith.com" />
		</div>
        <div class="form-group">
			<label for="title">Requestor Role</label>
			<input type="text" class="form-control" id="email" v-model="requestorRole" placeholder="Contractor" />
		</div>
		<div class="form-group">
			<label for="title">Signer Name</label>
			<input type="text" class="form-control" id="name" v-model="signerName" placeholder="Jon Smith" />
		</div>
		<div class="form-group">
			<label for="title">Signer Email</label>
			<input type="email" class="form-control" id="email" v-model="signerEmail" placeholder="jon@smith.com" />
		</div>
        <div class="form-group">
			<label for="title">Signer Role</label>
			<input type="text" class="form-control" id="email" v-model="signerRole" placeholder="Client" />
		</div>
        <button type="button" class="btn btn-primary" @click="requestSignature">Request Signature</button>
	</div>
</template>

<script lang="ts" setup>
import router from '@/main';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const contractElement = ref<HTMLDivElement>();

const props = defineProps({
	contractText: String
});

const title = ref('Sample Title');
const subject = ref('Please sign the contract');
const message = ref('Please sign the contract that contains the project details');
const roles = ref('Client,Contractor');
const templateCreated = ref(false);
const templateId = ref('');

const requestorName = ref('Michal Kieloch');
const requestorEmail = ref('mkieloch352@gmail.com');
const requestorRole = ref('Contractor');
const signerName = ref('Mike Kieloch');
const signerEmail = ref('mkieloch352@gmail.com');
const signerRole = ref('Client');

type Template = {
	templateId: string;
	editUrl: string;
};

type SignatureResponse = {
    contractUrl: string;
};

async function generateTemplate() {
	const request = {
		content: contractElement.value?.outerHTML,
		roles: roles.value
	};

	const response = await fetch('dropbox/template', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(request)
	});

	if (response.status == 200) {
		const template = (await response.json()) as Template;
		templateId.value = template.templateId;
		const client = new window.HelloSign({
			clientId: 'bc9a07dcff8d15eec6ebfe0061dbc9a8'
		});
		client.open(template.editUrl, {
			skipDomainVerification: true
		});

		client.on('close', async () => {
			templateCreated.value = true;
		});
	}
}

async function requestSignature() {
	const signatureRequest = {
		title: title.value,
		subject: subject.value,
		message: message.value,
		templateId: templateId.value,
        requestorName: requestorName.value,
        requestorEmail: requestorEmail.value,
        requestorRole: requestorRole.value,
		signerName: signerName.value,
		signerEmail: signerEmail.value,
        signerRole: signerRole.value
	};

	const response = await fetch('dropbox/sign', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(signatureRequest)
	});

    if (response.status == 200) {
        alert(`Your signature request has been sent to ${signerName.value}`);
        const signatureResponse = await response.json() as SignatureResponse;
        //window.location = signatureResponse.contractUrl;
        //router.push("/con")
    }
}
</script>

<style scoped>
.generated-contract {
	height: 80%;
	overflow-y: scroll;
}
</style>
