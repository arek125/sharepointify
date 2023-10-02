<script setup lang="ts">
//import { onMounted } from 'vue';
import useFormInit from '../composables/useFormInit'
import useFormSave from '../composables/useFormSave'
import {watch, isRef, reactive, ref, onMounted, toRaw} from 'vue'
import { useRoute } from 'vue-router'
//import textField from './formControls/textField.vue'
import { useFormStore } from '@/stores/form'
import { useMainStore } from '@/stores/main'
// console.log(isRef(columnNames))
// watch(columns, (newVal) => {
//     console.log(newVal); // should log the fetched data
// });
// console.log(isRef(columnNames))
// const props = defineProps({
//     listName: { type: String, required: true }
// })
const listName = 'Lista Testowa'
const formStore = useFormStore()
const mainStore = useMainStore()
const editableColumns = ref<string[]>(['Title','PackedDate','ChoiceRadio','Status','Liczby','Realizujacy', 'MultiUsers','FromGroup', 'App'])
const formInitilize = ref<boolean>(false)



const route = useRoute()
const itemId:string = Array.isArray(route.params.id)?route.params.id[0]:route.params.id
const { columns, columnNames, readOnlyFields, editableFields, initForm, getCol } = useFormInit(listName, editableColumns.value, itemId?"Id eq "+itemId:undefined)
const formValid = ref(false)
const iteratorTest = ref(null)
const { saveEverything, saving } = useFormSave(listName,itemId)

onMounted(async () => {
    await initForm()
    //console.log(readOnlyFields.value)
    formStore.init(editableFields.value[0], columns.value)
    formInitilize.value = true
})

// watch(readOnlyFields, () => {
//     console.log(readOnlyFields.value); // should log the fetched data
// });
// watch(editableFields, () => {
//     console.log(editableFields.value); // should log the fetched data
// });
const submit = async ()=>{
    if(formValid.value){
        console.log(iteratorTest.value)
        await saveEverything([toRaw(iteratorTest.value)])
    }
    else mainStore.setAlert('red','Invalid Form !')
    //await saveForm()
}
</script>

<template>
    <v-card class="mx-auto" :loading="saving || !formInitilize">
        <v-skeleton-loader v-if="!formInitilize"></v-skeleton-loader>
        <v-form v-model="formValid" lazy-validation @submit.prevent="submit()" :disabled="saving" v-else>
            <v-container>
                <v-row>
                    <v-col cols="12" md="4">
                        <textField v-model="formStore.formData.Title" :colInfo="getCol('Title')" :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <textField v-model="formStore.formData.Liczby" :colInfo="getCol('Liczby')" :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <dateField v-model="formStore.formData.PackedDate" :colInfo="getCol('PackedDate')" :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <radioField v-model="formStore.formData.ChoiceRadio" :colInfo="getCol('ChoiceRadio')" :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <selectField v-model="formStore.formData.Status" :colInfo="getCol('Status')" :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <textAreaField v-model="formStore.formData.PanelAkcji" :colInfo="getCol('PanelAkcji')" :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <peopleField v-model="formStore.formData.Realizujacy" :colInfo="getCol('Realizujacy')"  :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <peopleField  v-model="formStore.formData.MultiUsers" :colInfo="getCol('MultiUsers')"  :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <peopleField  v-model="formStore.formData.FromGroup" :colInfo="getCol('FromGroup')"  :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4">
                        <lookupField  v-model="formStore.formData.App" :colInfo="getCol('App')"  :readonly="false"/>
                    </v-col>
                    <v-col cols="12" md="4" v-if="readOnlyFields.length && route.params.id">
                        <attachmentsList :saved-files="readOnlyFields[0].attachmentFiles" v-model:filesToRemove="formStore.filesToRemove" />
                    </v-col>
                    <v-col cols="12">
                        <dataIterator ref="iteratorTest" listName="Lista testowa 2" queryFilter="Parent/Id eq " keyColumn="Title" lookupColumn="ParentId" :parentId="itemId"  :readonly="false" 
                            :editableColumns="['Title', 'Tester', 'App', 'Flow']">
                            <template #Title="{ value, column, index, update, key }">
                                <v-col cols="12" md="4">
                                    <textField :value="value" @input="update($event,index,key)" :colInfo="column" :readonly="false"/>
                                </v-col>
                            </template>
                            <template #Tester="{ value, column, index, update, key }">
                                <v-col cols="12" md="4">
                                    <peopleField  :value="value" @input="update($event,index,key)" :colInfo="column" :readonly="false"/>
                                </v-col>
                            </template>
                            <template #App="{ value, column, index, update, key }">
                                <v-col cols="12" md="4">
                                    <lookupField :value="value" @input="update($event,index,key)" :colInfo="column" :readonly="false"/>
                                </v-col>
                            </template>
                            <template #Flow="{ value, column, index, update, key }">
                                <v-col cols="12" md="4">
                                    <selectField :value="value" @input="update($event,index,key)" :colInfo="column" :readonly="false"/>
                                </v-col>
                            </template>
                        </dataIterator>
                    </v-col>
                </v-row>
                <attachmentsUpload  v-model:filesToUpload="formStore.filesToUpload"/>

            </v-container>
            <v-card-actions >
                <v-spacer></v-spacer>
                <v-btn  color="success" class="mr-4" type="submit" variant="flat" :loading="saving"> Save </v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
</template>