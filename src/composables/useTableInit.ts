import { ref, computed } from "vue";
// import axios from "axios";
// import dayjs from 'dayjs'
import useUtils from '../composables/useUtils'
import type { columnInfoI, tableHeaderI } from '@/types'

const useTableInit = (listName:string, tableHeadersInit:tableHeaderI[])=>{
    //const mainUrl = inject('$mainUrl')
    const columns = ref<columnInfoI[]>([])
    const tableHeaders = ref<tableHeaderI[]>([])
    const initLoading = ref<boolean>(true)
    const { getListColumnsInfo } = useUtils()

    const expandColumns = ref<string[]>([])
    const selectColumns = computed(() => {
        
        let selectCols:string[] = tableHeaders.value.map(el=>{
            if (el.type == "User" || el.type == "UserMulti"||el.type == "Lookup" || el.type == "LookupMulti")return el.key+"/Id"
            else return el.key
        }).filter(el=>el!='actions' && el!='AttachmentFiles')

        for(let el of tableHeaders.value){
            if (el.type == "User" || el.type == "UserMulti"||el.type == "Lookup" || el.type == "LookupMulti"){
                selectCols.push(el.key+"/Title")
                expandColumns.value.push(el.key)
            }
            else if (el.key == "AttachmentFiles"){
                selectCols.push(el.key+"/FileName")
                selectCols.push(el.key+"/ServerRelativeUrl")
                expandColumns.value.push(el.key)
            }
        }
        return selectCols
    })
    const visibleColumns = computed(()=>{
        return tableHeaders.value.filter(el=>el.key!='actions'&& el.align!=' d-none')
    })

    const initTable = async () => {
        columns.value = await getListColumnsInfo(listName)
        tableHeaders.value = tableHeadersInit.map(x=>{
            const column = columns.value.find(y=>y.staticName == x.key)
            let header:tableHeaderI = x
            if(column)header = {
                key: x.key,
                title: x.title?x.title:column?.label,
                type: column.type?column.type:x.type,
                format: column.format,
                sortable: column.type == "Note"?false:true,
                choices: column.choices
            }

            return header
        })
        initLoading.value = false
    }
    return { initTable, tableHeaders, initLoading, selectColumns, expandColumns, visibleColumns }
}
export default useTableInit