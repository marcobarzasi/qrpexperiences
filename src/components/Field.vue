<script lang="ts" setup>
const value = defineModel<string | number>('value', {required: true});
const emit = defineEmits(['update:validator'])

defineProps({
  label: String,
  labelStyle: String,
  postLabel: String,
  status: String,
  error: String,
  readOnly: Boolean,
  type: {type: String, default: 'text'},
  placeholder: String,
  labelWidth: String,
  dataList: Object,
})
</script>

<template>

  <!--  <InputGroup>
      <InputGroupAddon :style="labelStyle">
        <div class="w-100 text-start">{{ label }}</div>
      </InputGroupAddon>

      <Password v-if="props.type=='password'" v-model="value" @change="emit('update:validator')" :class="{'p-invalid' : status=='INVALID'}" toggleMask />
      <Calendar v-else-if="type=='data'" showIcon iconDisplay="input" v-model="value" @change="emit('update:validator')" :class="{'p-invalid' : status=='INVALID'}" toggleMask />
      <InputText v-else v-model="value" :type="type" @change="emit('update:validator')" :class="{'p-invalid' : status=='INVALID'}"/>

      <InputGroupAddon class="bg-danger" :title="error" v-if="status=='INVALID'">
        <i class="text-white fa-solid fa-circle-exclamation"></i>
      </InputGroupAddon>
      <InputGroupAddon v-if="postLabel">
        {{ postLabel }}
      </InputGroupAddon>
    </InputGroup>-->



  <div class="input-group">
    <span :style="labelStyle" class="input-group-text">{{ label }}</span>
    <input
        :title="error"
        v-model="value"
        :class="'form-control ' +  (status==='INVALID' ? 'is-invalid' : '') +  (status==='VALID' ? 'is-valid' : '')"
        :disabled="readOnly"
        :list="label"
        :placeholder="placeholder"
        :readonly="readOnly"
        :type="type"
        @change="emit('update:validator')"
    />
    <datalist :id="label">
      <option v-for="item in dataList" :value="item"/>
    </datalist>
    <span v-if="postLabel" class="input-group-text">{{ postLabel }}</span>
    <!--    <span :title="error" v-if="status=='INVALID'" class="bg-danger input-group-text"><i class="text-white fa-solid fa-question"></i></span>-->
    <!--    <div class="invalid-feedback">{{ error }}</div>-->
  </div>

</template>

<style scoped>

</style>