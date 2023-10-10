<template>
    <div class="row">
      <Prompt @contract-generated="contractGenerated"/>
      <Contract :contract-text="contractResponse" />
    </div>
</template>

<script lang="ts" setup>
 import Prompt from '@/components/Prompt.vue'
    import Contract from '@/components/Contract.vue'
import { ref } from 'vue';

    const contractResponse = ref("");

    function contractGenerated(response: string) {
      contractResponse.value = response;
    }
</script>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>