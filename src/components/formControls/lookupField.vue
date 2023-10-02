<script setup lang="ts">
import type { columnInfoI, autocompleteChoiceI } from '@/types'
import type { PropType } from 'vue'
import { ref, watch, onMounted, inject } from 'vue'
// import { useFormStore } from '@/stores/form'
import axios from 'axios'

// const formStore = useFormStore()
const mainUrl = inject('$mainUrl')
const props = defineProps({
    colInfo: { type: Object as PropType<columnInfoI>, required: true},
    rules: { type: Array as PropType<any[]> },
    readonly: { type: Boolean, required: true },
    //columnName: { type: String, required: true },
    value: Object as PropType<autocompleteChoiceI | autocompleteChoiceI[]>,
    async: {type: Boolean, default: true}
        
})
// const colInfo = ref<columnInfoI | undefined>(formStore.getCol(props.columnName))
const rules = ref([v => !!v || !props.colInfo.required || 'Required !'])
if(props.rules)for(const fct of props.rules)rules.value.push(fct)

const search = ref<string>()
const isLoading = ref<boolean>(false)
const choices = ref<autocompleteChoiceI[]>([])
const _value = ref(props.value)
let timerId

onMounted(async () => {
    await getData(100)
    if(props.value && !Array.isArray(props.value) && !choices.value?.length && props.colInfo.type != 'LookupMulti')
        choices.value.push(props.value)
    else if(props.colInfo && props.colInfo.type == 'LookupMulti' && Array.isArray(props.value) && props.value.length && !choices.value?.length)
        choices.value = props.value
})

const getData = async ($top:Number, val?:string,) =>{
    if(!props.colInfo.lookupField || !props.colInfo.lookupList)throw 'Not a lookup field ?!'
    const response = await axios.get(mainUrl +"/_api/web/lists(guid'"+props.colInfo.lookupList+"')/items",{
        params:{
            //$expand: ['Author','Editor','AttachmentFiles'].join(','),
            $select: ['Id',props.colInfo.lookupField].join(','),
            $filter: val?"substringof('"+val+"',"+props.colInfo.lookupField+")":undefined,
            $top
        }
    })
    for (let el of response.data.value) {
        choices.value.push({
            title: el[props.colInfo.lookupField],
            value: el['Id']
        })
    }
}
if(props.async && !props.readonly)
    watch(search, (val) => {
        if(val && val.length > 2){
            clearTimeout(timerId)
            timerId = setTimeout(async () => {
                isLoading.value = true
                choices.value = []
                await getData(25,val)
                isLoading.value = false
            }, 500)
        }

    })

</script>

<template>
    <v-autocomplete v-if="props.async"
        v-model="_value"
        :items="choices"
        :loading="isLoading"
        v-model:search="search"
        no-filter
        chips
        :closable-chips="props.colInfo.type ==  'LookupMulti'"
        :label="props.colInfo.label"
        :required="props.colInfo.required"
        placeholder="Start typing to Search"
        prepend-icon="mdi-table-search"
        return-object
        cache-items
        :multiple="props.colInfo.type == 'LookupMulti'"
        :rules="rules"
        :prepend-inner-icon="props.colInfo.required&&!_value?'mdi-alert-decagram-outline':undefined"
        :readonly="props.readonly"
        @update:model-value="$emit('input', _value)"
    ></v-autocomplete>
    <v-select v-else
        v-model="_value"
        :label="props.colInfo.label"
        :required="props.colInfo.required"
        :items="choices"
        :multiple="props.colInfo.type == 'LookupMulti'"
        :rules="rules"
        return-object
        :prepend-inner-icon="props.colInfo.required&&!_value?'mdi-alert-decagram-outline':undefined"
        :readonly="props.readonly"
        @update:model-value="$emit('input', _value)"
    ></v-select>
</template>

