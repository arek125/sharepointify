
import { ref, inject, computed } from "vue";
import axios from "axios";
import dayjs from 'dayjs'
import useUtils from '../composables/useUtils'
import type { columnInfoI,formReadOnlyFieldsI } from '@/types'

const useFormInit = (listName:string, formColumnNames:string[], filter?:string)=>{
    const mainUrl = inject('$mainUrl')
    const columns = ref<columnInfoI[]>([])
    const { parseJsonTofield, getListColumnsInfo } = useUtils()
    const columnNames= computed(() => {
        return columns.value?.map(x=>x.staticName)
    })
    const readOnlyFields = ref<formReadOnlyFieldsI[]>([])
    const editableFields = ref<Object[]>([])
    const initLoading = ref<Boolean>(true)
    // const getListColumnsInfo = async () => {
    //     const response = await axios.get(mainUrl +"/_api/web/lists/getbytitle('"+listName+"')/fields?$filter=Hidden eq false")
    //     const parser = new DOMParser()
    //     for (let colInfo of response.data.value){
    //         const doc = parser.parseFromString(colInfo.SchemaXml, "application/xml")
    //         const field = doc.getElementsByTagName("Field")[0]
    //         columns.value.push({
    //             staticName: colInfo["StaticName"],
    //             label: colInfo["Title"],
    //             defaultValue: colInfo["DefaultValue"],
    //             required: colInfo["Required"],
    //             type: field.getAttribute("Type"),
    //             format: field.getAttribute("Format"),
    //             userSelectionScope: field.getAttribute("UserSelectionScope"),
    //             userSelectionMode: field.getAttribute("UserSelectionMode"),
    //             choices: colInfo?.Choices,
    //             lookupField: colInfo["LookupField"],
    //             lookupList: colInfo["LookupList"]?colInfo["LookupList"].replaceAll(/{|}/g,""):null
    //         })
    //     }
    // }

    const getCol = (staticName) =>{
        return columns.value.find(x=>x.staticName == staticName)
    }

    const getElemData = async (filter) => {
        //let readOnlyFields, editableFields = []
        const response = await axios.get(mainUrl +"/_api/web/lists/getbytitle('"+listName+"')/items",{
            params:{
                $expand: ['Author','Editor','AttachmentFiles'].join(','),
                $select: ['Id','Created', 'Author/Title' ,'Author/Id', 'Editor/Title','Editor/Id','Modified','AttachmentFiles/FileName','AttachmentFiles/ServerRelativeUrl'].join(','),
                $filter: filter,
                $top: 100
            }
        })
        if(response.data.value.length){
            readOnlyFields.value = response.data.value.map(item=>{
                return {
                    id: item.Id,
                    created: dayjs(item.Created).format("YYYY-MM-DD HH:mm"),
                    author: item.Author,
                    modified:dayjs(item.Modified).format("YYYY-MM-DD HH:mm"),
                    editor: item.Editor,
                    attachmentFiles: item.AttachmentFiles 
                }
            })
        }
        let i:number,j:number,chunk = 12
        for (i=0,j=formColumnNames.length; i<j; i+=chunk){
            let columnNamesSplited10 = formColumnNames.slice(i,i+chunk)
            let selectColumns = columnNamesSplited10.map(el=>{
                let col = columns.value.find(x=>x.staticName == el)
                if(!col)throw 'Column' + el + ' not found'
                if (col.type == "User" || col.type == "UserMulti"||col.type == "Lookup" || col.type == "LookupMulti")return el+"/Id,"+el+"/Title"
                else return el
            })
            let expandColumns = columnNamesSplited10.filter(el=>{
                let col = columns.value.find(x=>x.staticName == el)
                if(!col)throw 'Column' + el + ' not found'
                if (col.type == "User" || col.type == "UserMulti"||col.type == "Lookup" || col.type == "LookupMulti")return true
                else return false
            })
            const response = await axios.get(mainUrl +"/_api/web/lists/getbytitle('"+listName+"')/items",{
                params:{
                    $expand: expandColumns.length?expandColumns.join(','):undefined,
                    $select: selectColumns.join(','),
                    $filter: filter,
                    $top: 100
                }
            })
            if(response.data.value.length){
                for(let k=0;k<response.data.value.length;k++)
                    for (let staticName of columnNamesSplited10 ){
                        let col = columns.value.find(x=>x.staticName == staticName)
                        if(!col)throw 'Column' + staticName + 'not found'
                        let fieldData = parseJsonTofield(response.data.value[k][staticName],col)
                        editableFields.value[k] = Object.assign({}, editableFields.value[k], { [staticName]: JSON.parse(JSON.stringify(fieldData))})
                    }
            }
        }
        //return { readOnlyFields, editableFields }
    }
    const initForm = async () => {
        columns.value = await getListColumnsInfo(listName)
        if(filter)await getElemData(filter)
        else {
            editableFields.value.push(formColumnNames.reduce((a, v) => ({ ...a, [v]: null}), {}) )
            readOnlyFields.value.push({id: -1})
        }
        initLoading.value = false
    }
    return { columnNames, columns, initLoading,  readOnlyFields, editableFields, initForm, getCol}
}
export default useFormInit