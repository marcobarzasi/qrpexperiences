<script lang="ts" setup>
const value = defineModel<string>('value', {required: true});
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

  <div class="input-group">
    <span :style="labelStyle" class="input-group-text">{{ label }}</span>

    <select v-model="value" :disabled="readOnly"
            :readonly="readOnly"
            :title="error"
            :class="'form-select ' +  (status==='INVALID' ? 'is-invalid' : '') +  (status==='VALID' ? 'is-valid' : '')"
            @change="emit('update:validator')">
      <option v-for="item in dataList" :value="item.value">{{ item.label }}</option>
    </select>

    <span v-if="postLabel" class="input-group-text">{{ postLabel }}</span>
  </div>

</template>

<style scoped>

</style>