<template>
    <div class="col-md-12">
        <div class="form-group">
            <label for="contract">What type of contract do you want to generate?</label>
            <textarea type="text" class="form-control" id="contract" v-model="contractPrompt" placeholder="Generate a remodel contract"></textarea>
            <!--<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>-->
        </div>
        <button type="button" class="btn btn-primary" :disabled="!contractPrompt" @click="generateContract">Generate</button>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue';

    const contractPrompt = ref("");
    const emits = defineEmits(["contractGenerated"]);

    async function generateContract() {
        const response = await fetch('prompt', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Prompt: contractPrompt.value })
        });

        if (response.status == 200) {
            const json = await response.json();
            const generatedContract = json.response;
            console.log(generatedContract);
            emits("contractGenerated", generatedContract);
        }
    }
</script>

<style type="text/css">

</style>