<script setup lang="ts">
import {watch, ref, onMounted, toRaw , computed} from 'vue'
import type { PropType } from 'vue'
import useTableInit from '../composables/useTableInit'
import useTableData from '../composables/useTableData'
import useUtils from '../composables/useUtils'
// import { useRoute } from 'vue-router'
// import { useMainStore } from '@/stores/main'
import type { tableHeaderI, listActionI } from '@/types'

const props = defineProps({
    listName: {
        type: String,
        required: true
    },
    sortBy: {
        type: Array as PropType<any[]>,
        default: [{key: 'Id', order: 'asc'}]
    },
    tableHeadersInit: {
        type: Array as PropType<tableHeaderI[]>,
        default: [
            { key: "Id", title: "Id" },
            { key: "Title" }
        ]
    },
    actions: Array as PropType<listActionI[]>
})

//const currentSortBy = ref<any[]>(props.sortBy)
const filtersRef = ref<any>(null)

const { initTable, tableHeaders, initLoading,  selectColumns, expandColumns, visibleColumns } = useTableInit(props.listName, props.tableHeadersInit)
const { getData, dataLoading, items, nextPage, selectColumnsData, expandColumnsData, currentSortBy, currentFilter } = useTableData(props.listName,props.sortBy)
const { parseColVal } = useUtils()
onMounted(async () => {
    await initTable()
    selectColumnsData.value = selectColumns.value
    expandColumnsData.value = expandColumns.value
    //getData(selectColumns.value,expandColumns.value)
})
// watch(filtersRef.searchQuery.value, (newVal) => {
//     console.log(newVal)
// });

const loadItems = async ({ sortBy })=> {
    currentSortBy.value = sortBy
    getData()
}

const onSearchQuery = (query)=>{
    currentFilter.value = query
    getData()
}

const extraLookup = (col,item)=>{
    let splitedCol = col.value.split('/')
    if(item[splitedCol[0]])
        return parseColVal(col.type,item[splitedCol[0]][splitedCol[1]],col.format)
    else return ""
}

</script>

<template>
    <v-container :loading="initLoading" v-if="!initLoading">
        <v-row>
            <v-toolbar flat>
                <v-spacer />
                <v-btn
                    class="ma-2"
                    color="primary"
                    icon="mdi-filter-plus"
                    @click="filtersRef?.addFilter()"
                ></v-btn>
            </v-toolbar>
        </v-row>
        <v-row>
            <dynamicFilters :visible-columns="visibleColumns" ref="filtersRef"  @newSearchQuery="onSearchQuery"/>
        </v-row>
        <v-row>
            <v-data-table-server
                items-per-page="-1"
                items-length="-1"
                :headers="(tableHeaders as any)"
                :items="items"
                :loading="dataLoading"
                :sort-by="sortBy"
                @update:options="loadItems"
                class="elevation-1"
                item-value="Id"
            >
                <template v-for="col in visibleColumns.filter(x=>x.key!='Attachments'&&x.key!='AttachmentFiles')"  v-slot:[`item.${col.key}`]="{ item }" :key="col.key">
                    <span v-if="col.key.includes('/')" >{{extraLookup(col,item.columns)}}</span>
                    <span v-else-if="col.format == 'FullHtml'" v-html="item.columns[col.key]"></span>
                    <span v-else >{{parseColVal(col.type,item.columns[col.key],col.format)}}</span>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip v-for="action in actions" :key="action.icon" bottom :text="action.hintText">
                        <template v-slot:activator="{ props }">
                            <v-icon
                                :color="action.color"
                                @click="action.click(item.columns)"
                                style="margin-right: 2px;"
                                v-bind="props"
                            >
                                {{ action.icon }}
                            </v-icon>
                        </template>
                    </v-tooltip>
                </template>

                <template v-slot:bottom>
                    <v-btn v-if="nextPage"
                        v-intersect="(isIntersecting)=>{
                            if(isIntersecting)getData(nextPage);
                        }"
                        @click="getData(nextPage)"
                    >
                        Load more
                    </v-btn>
                </template>
            </v-data-table-server>
        </v-row>
    </v-container>

</template>