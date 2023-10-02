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
    inline: { type: Boolean, default: true },
    value: String
})
//const colInfo = ref<columnInfoI | undefined>(formStore.getCol(props.columnName))
const rules = ref([v => !!v || !props.colInfo.required || 'Required !'])
if(props.rules)for(const fct of props.rules)rules.value.push(fct)
const _value = ref(props.value)
</script>

<template>
    <v-radio-group
        v-model="_value"
        row
        :rules="rules"
        :label="props.colInfo.label"
        :prepend-inner-icon="props.colInfo.required&&!_value?'mdi-alert-decagram-outline':undefined"
        :readonly="props.readonly"
        :inline="props.inline"
        @update:model-value="$emit('input', _value)"
    >
        <v-radio v-for="el in props.colInfo.choices" 
            :key="el"
            :label="el"
            :value="el"
        ></v-radio>
    </v-radio-group>
</template>