<script setup lang="ts">
import type { columnInfoI } from '@/types'
import type { PropType } from 'vue'
import { ref } from 'vue'
// import { useFormStore } from '@/stores/form'
// const formStore = useFormStore()

const props = defineProps({
    colInfo: { type: Object as PropType<columnInfoI>, required: true},
    rules: { type: Array as PropType<any[]> },
    readonly: { type: Boolean, required: true },
    //columnName: { type: String, required: true },
    value: String
})
//const colInfo = ref<columnInfoI | undefined>(formStore.getCol(props.columnName))
const rules = ref([v => !!v || !props.colInfo.required || 'Required !'])
if(props.rules)for(const fct of props.rules)rules.value.push(fct)
const _value = ref(props.value)
</script>

<template>
    <v-select
    v-model="_value"
    :label="props.colInfo.label"
    :required="props.colInfo.required"
    :items="props.colInfo.choices"
    :multiple="props.colInfo.type == 'MultiChoice'"
    :rules="rules"
    return-object
    :prepend-inner-icon="colInfo.required&&!_value?'mdi-alert-decagram-outline':undefined"
    :readonly="props.readonly"
    @update:model-value="$emit('input', _value)"
    ></v-select>
</template>