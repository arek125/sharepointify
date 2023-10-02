<script setup lang="ts">
import type { columnInfoI } from '@/types'
import type { PropType } from 'vue'
import { ref, onMounted, watch, toRaw } from 'vue'
import useFormInit from '@/composables/useFormInit'

const props = defineProps({
    listName: { type: String , required: true},
    queryFilter: { type: String, required: true },
    lookupColumn: { type: String, required: true },
    keyColumn: { type: String, required: true },
    parentId: { type: Number, required: false },
    readonly: { type: Boolean, required: true },
    editableColumns: {type: Array as PropType<string[]>, required: true},
    sortBy: {
        type: Array as PropType<any[]>,
        required: false
    },
    groupBy: {
        type: Array as PropType<any[]>,
        required: false
    },
    //columnName: { type: String, required: true }
})

const { readOnlyFields, editableFields, initForm, getCol, columns } = useFormInit(props.listName, props.editableColumns,props.parentId?props.queryFilter + props.parentId:undefined)
const mainItems = ref<any[]>([])
const deletedItems = ref<Number[]>([])
const formInitilize = ref<boolean>(false)
onMounted(async () => {
    await initForm()
    console.log(editableFields.value,readOnlyFields.value)
    if(editableFields.value.length)
    //mainItems.value = [...unref(editableFields),...unref(readOnlyFields)]
        for (const [i, v] of editableFields.value.entries()) {
            mainItems.value.push(Object.assign({},toRaw(v),{id: readOnlyFields.value[i].id}))
        }
    console.log(mainItems.value)
    formInitilize.value = true
})

const addNew = () => {
    mainItems.value.push(props.editableColumns.reduce((a, v) => ({ ...a, [v]: null, id: -1}), {}) )
}
const update = (event,index,columnTitle) => {
    if (typeof event == 'object' && event.target) return
    mainItems.value[index][columnTitle] = event
}


const removeItem = (index) => {
    if(mainItems.value[index].id != -1)
        deletedItems.value.push(mainItems.value[index].id)
    mainItems.value.splice(index, 1)
}

watch(mainItems.value, (v) => {
    console.log(v);
});

defineExpose({
    mainItems,
    deletedItems,
    props,
    columns
})
</script>

<template>
    <v-data-iterator v-if="formInitilize"
        :items="mainItems"
        :group-by="groupBy"
        :sort-by="sortBy"
    >

        <template v-slot:header>
            <v-card-title class="subheading font-weight-bold">
                {{ props.listName }}
            </v-card-title>
        </template>

        <template v-slot:no-data>
            <v-icon>mdi-alert</v-icon> No items
        </template>

        <template v-slot:default="{items, groupedItems}">
            <v-container fluid>
            <v-row dense v-if="groupBy" v-for="(group,index_) in groupedItems" :key="index_">
            <v-col cols="12"><h2>{{ group.value }}</h2></v-col>
            <v-col v-if="group.type == 'group'" v-for="(item,index) in group.items" :key="index" cols="12" >
                <v-sheet rounded="10" :color="'grey-lighten-3'" v-if="item.type=='item'">
                    <v-container fluid>
                    <v-row dense>
                        <slot v-for="(columnName) in props.editableColumns" :key="columnName" :name="columnName" :value="item.raw[columnName]" :index="index" :column="getCol(columnName)" :update="update" ></slot>
                        <v-col cols="1" align-self="center">
                            <v-btn icon color="grey" class="float-right" @click="removeItem(index)" :disabled="readonly">
                                <v-icon large>mdi-delete</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    </v-container>
                </v-sheet>
            </v-col>
            </v-row>
            <v-row dense v-else>
            <v-col v-for="(item,index) in items" :key="index" cols="12">
                <v-sheet rounded="10" :color="'grey-lighten-3'">
                    <v-container fluid>
                    <v-row dense>
                        <slot v-for="(columnName) in props.editableColumns" :key="columnName" :name="columnName" :value="item.raw[columnName]" :index="index" :column="getCol(columnName)" :update="update" ></slot>
                        <v-col cols="1" align-self="center">
                            <v-btn icon color="grey" class="float-right" @click="removeItem(index)" :disabled="readonly">
                                <v-icon large>mdi-delete</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                    </v-container>
                </v-sheet>
            </v-col>
            </v-row>
            </v-container>
        </template>
        <template v-slot:footer>
            <v-btn icon="mdi-plus" size="large" @click="addNew"></v-btn>
        </template>
    </v-data-iterator>
</template>