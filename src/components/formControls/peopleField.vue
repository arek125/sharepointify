<script setup lang="ts">
import type { columnInfoI, autocompleteChoiceI } from '@/types'
import type { PropType } from 'vue'
import { ref, watch, onMounted, inject } from 'vue'
// import { useFormStore } from '@/stores/form'
import axios from 'axios'
import { useMainStore } from '@/stores/main'
//import $SP from 'sharepointplus'
const mainStore = useMainStore()
// const formStore = useFormStore()
const mainUrl = inject('$mainUrl')
const props = defineProps({
    colInfo: { type: Object as PropType<columnInfoI>, required: true},
    rules: { type: Array as PropType<any[]> },
    readonly: { type: Boolean, required: true },
    //columnName: { type: String, required: true },
    value: Object as PropType<autocompleteChoiceI | autocompleteChoiceI[]> 
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
    if(props.value && !Array.isArray(props.value) && !choices.value?.length && props.colInfo.type != 'UserMulti')
        choices.value.push(props.value)
    else if(props.colInfo && props.colInfo.type == 'UserMulti' && Array.isArray(props.value) && props.value.length && !choices.value?.length)
        choices.value = props.value
    if(props.colInfo.userSelectionScope != "0")
        searchInSpGroup(props.colInfo.userSelectionScope)
})

const searchInSpGroup = async (groupId, val?) =>{
    const response = await axios.get(mainUrl +'/_api/Web/SiteGroups/GetById('+groupId+')/users',{
        params:{
            //$expand: ['Author','Editor','AttachmentFiles'].join(','),
            $select: ['Title','Id'].join(','),
            $filter: val?"substringof('"+val[0].toUpperCase() + val.slice(1)+"',Title)":undefined,
            $orderby: "Title",
            $top: 25
        }
    })
    for (let user of response.data.value) {
        choices.value.push({
            title: user['Title'],
            value: user['Id']
        })
    }
}
const searchGroups = async (val?) =>{
    const response = await axios.get(mainUrl +'/_api/web/sitegroups',{
        params:{
            //$expand: ['Author','Editor','AttachmentFiles'].join(','),
            $select: ['Title','Id'].join(','),
            $filter: val?"substringof('"+val[0].toUpperCase() + val.slice(1)+"',Title)":undefined,
            $orderby: "Title",
            $top: 25
        }
    })
    for (let user of response.data.value) {
        choices.value.push({
            title: user['Title'],
            value: user['Id']
        })
    }
}

const searchUserInAd = async (val) =>{
    const data = await axios.post(mainUrl+"/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser",JSON.stringify(
        {  
            'queryParams':{  
                '__metadata':{  
                    'type':'SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters'  
                },  
                'AllowEmailAddresses':true,  
                'AllowMultipleEntities':false,  
                'AllUrlZones':false,  
                'MaximumEntitySuggestions':50,  
                'PrincipalSource':15,  
                'PrincipalType': 15,  
                'QueryString':val,
                'Required':false  
                
            }  
        }
    ),{ headers: mainStore.createHeaders})
    return JSON.parse(data.data.d.ClientPeoplePickerSearchUser)
}

const emit = defineEmits(['update:modelValue'])
if(!props.readonly){
    watch(search, (val) => {
        if(val && val.length > 3){
            clearTimeout(timerId)
            timerId = setTimeout(async () => {
                isLoading.value = true
                choices.value = []
                if(props.colInfo.userSelectionScope == "0" ){
                    const people = await searchUserInAd(val)
                    choices.value = people.map(x=>{ return {title: x.DisplayText, value: x.Key}})
                    if(props.colInfo.userSelectionMode == "PeopleAndGroups"){
                        await searchGroups(val)
                    }
                }else await searchInSpGroup(props.colInfo.userSelectionScope,val)

                isLoading.value = false
            }, 500)
        }

    })
    watch(_value, async () => {
        if(Array.isArray(_value.value)){
            for(const i in _value.value)
                _value.value[i] = await ensureUser(_value.value[i])
        }else if(_value.value)_value.value = await ensureUser(_value.value)
        emit('update:modelValue', _value)
    })
}

const ensureUser = async (newVal:autocompleteChoiceI)=>{
    if(typeof newVal.value == 'string'){
        const response = await axios.post(mainUrl+"/_api/web/ensureuser('"+encodeURIComponent(newVal.value)+"')",{},{ headers: mainStore.createHeaders})
        return {
            title: newVal.title,
            value: response.data.d?.Id
        }
    }else return newVal
}

</script>

<template>
    <v-autocomplete
        v-model="_value"
        :items="choices"
        :loading="isLoading"
        v-model:search="search"
        no-filter
        chips
        :closable-chips="props.colInfo.type ==  'UserMulti'"
        :label="props.colInfo.label"
        :required="props.colInfo.required"
        placeholder="Start typing to Search"
        prepend-icon="mdi-account-search"
        append-outer-icon=""
        return-object
        cache-items
        :multiple="props.colInfo.type == 'UserMulti'"
        :rules="rules"
        :prepend-inner-icon="props.colInfo.required&&!_value?'mdi-alert-decagram-outline':undefined"
        :readonly="props.readonly"
    ></v-autocomplete>
</template>

