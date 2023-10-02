<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { tableHeaderI, listFilterI } from '@/types'
import type { PropType } from 'vue'

const props = defineProps({
    visibleColumns: {
        type: Array as PropType<tableHeaderI[]>,
        required: true
    }
})

const filters = ref<listFilterI[]>([])
let searchTimeout

const getColType = (col) => {
    return props.visibleColumns.find(x => x.key == col)?.type
}

const filterChoices = (col)=>{
    let colType = getColType(col)
    console.log(colType,col)
    if(colType == "Number" || colType == "DateTime") return [{title: 'Equals (==)', value: 'Equal'},{title: 'Not equals (!=)', value: 'Not equal'},{title: 'Greater than(>)', value: 'Greater than'},{title: 'Less then(<)', value: 'Less then'},{title: 'Is null', value: 'Is null'}]
    else return [{title: 'Contains', value: 'Contains'},{title: 'Equals (==)', value: 'Equal'},{title: 'Not equals (!=)', value: 'Not equal'},{title: 'Is null', value: 'Is null'}]
}

const filterBracketOdd = computed(()=>{
    return (filters.value.filter(x=>x.leftBr).length + filters.value.filter(x=>x.rightBr).length) % 2 != 0
})

const addFilter = ()=>{
    filters.value.push({column:'Title',op:'',value:'',rowop: ' and ',leftBr: false,rightBr: false})
}


const emit = defineEmits(['newSearchQuery'])

watch(filters.value,()=>{
    let query = ""
    let filledFilters = filters.value.filter(x=>(x.value && x.op) || (!x.value && x.op == 'Is null'))
    for (const [i, filter] of filledFilters.entries()){
        let colType = getColType(filter.column)
        let column = (colType == "User" || colType == "UserMulti"||colType == "Lookup" || colType == "LookupMulti")?filter.column+"/Title":filter.column
        let value = "'"+filter.value+"'"
        if(colType=="Number")value = filter.value
        else if(colType=="DateTime")value = "datetime'"+filter.value+"T00%3a00%3a00'"
        if(filter.leftBr && !filterBracketOdd.value)query+="("
        switch(filter.op){
            case "Contains": query+="substringof("+value+","+column+")"; break
            case "Equal": query+= column+" eq "+value; break
            case "Not equal": query+= column+" ne "+value; break
            case "Less then": query+= column+" lt "+value; break
            case "Greater than": query+= column+" gt "+value; break
            case "Is null":  query+= column+ " eq null"; break
        }
        if(filter.rightBr && !filterBracketOdd.value)query+=")"
        if(i < (filledFilters.length-1))query+=filter.rowop
    }
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    searchTimeout = setTimeout(() => {
        emit('newSearchQuery',query)
    }, 1000)

},{deep: true})

defineExpose({
    addFilter,
})

</script>

<template>
    <v-table v-if="filters.length" style="width: 100%;">
        <thead>
            <tr>
                <th> </th>
                <th>(</th>
                <th class="text-left">
                    Column
                </th>
                <th class="text-left">
                    Operator
                </th>
                <th class="text-left">
                    Value
                </th>
                <th>)</th>
                <th class="text-left" v-if="filters.length > 1">
                    Connector
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(filter, index) in filters" :key="index">
                <td><v-icon color="secondary">mdi-filter</v-icon></td>
                <td><v-checkbox-btn v-model="filter.leftBr" :disabled="filterBracketOdd"
                        :ripple="false"></v-checkbox-btn></td>
                <td><v-select v-model="filter.column"
                        :items="visibleColumns.filter(x => x.type != 'Note' && x.type != 'LookupTask' && x.key != 'AttachmentFiles').map(x=>{return {title: x.title, value: x.key}})"></v-select>
                </td>
                <td><v-select v-model="filter.op" :items="filterChoices(filter.column)" required
                        :rules="[v => !!v || 'This field is required']"></v-select></td>
                <td>
                    <v-text-field v-show="filter.op != 'Is null'" v-model="filter.value" required
                        :rules="[v => !!v || 'This field is required']"
                        :type="getColType(filter.column) == 'DateTime' ? 'date' : 'text'"></v-text-field>
                </td>
                <td><v-checkbox-btn v-model="filter.rightBr" :disabled="!filterBracketOdd"
                        :ripple="false"></v-checkbox-btn></td>
                <td v-if="filters.length > 1"><v-select v-if="index < (filters.length - 1)" v-model="filter.rowop"
                        :items="[{ title: 'And (&&)', value: ' and ' }, { title: 'Or (||)', value: ' or ' }]"></v-select></td>
                <td>
                    <v-icon small @click="filters.splice(index, 1)">mdi-delete</v-icon>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>