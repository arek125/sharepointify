import { defineStore } from "pinia";
import { ref, inject } from "vue";
import axios from "axios";
import type { columnInfoI } from '@/types'

export const useFormStore = defineStore("form", () => { 
    //const mainUrl = inject('$mainUrl')
    const formData = ref()
    const filesToRemove = ref<string[]>([])
    const filesToUpload = ref<any[]>([])
    const columns = ref<columnInfoI[]>()
    const init = (editableFields, columns_:columnInfoI[])=>{
        formData.value = {...editableFields}
        columns.value = columns_
    }

    const getCol = (staticName) =>{
        return columns.value?.find(x=>x.staticName == staticName)
    }
    // let listAndColumnsInfo = ref()
    // const getListAndColumnsInfo = async (listName)=>{
    //     const response = await axios.get(mainUrl +"/_api/web/lists/getbytitle('"+listName+"')/fields?$filter=Hidden eq false")
    //     listAndColumnsInfo = response.data.d
    // }

     return {formData, init, columns, getCol, filesToRemove, filesToUpload}
})