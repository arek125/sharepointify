
import { inject,ref } from "vue";
// import axios from "axios";
//import dayjs from 'dayjs'
import { useFormStore } from '@/stores/form'
import { useMainStore } from '@/stores/main'
import axios from 'axios'
import useUtils from '../composables/useUtils'

import type { columnInfoI } from '@/types'

const useFormSave = (listName:String,itemId?:String) => {
    //const window:any = inject('$window')
    const mainUrl = inject('$mainUrl')
    const saving = ref<boolean>(false)
    //console.log(mainUrl)
    const formStore = useFormStore()
    const mainStore = useMainStore()
    const { getListItemType, getFileBuffer } = useUtils()

    const generateSaveObject = (values:Object,columns:columnInfoI[])=>{
        let saveObject = {}
        for (let [key, val] of Object.entries(values)) {
            const col = columns.find(x=>x.staticName == key)
            if(col)
            switch(col.type){
                case "MultiChoice":
                  val = {"results": val.filter(el=>el) }
                  break
                case "DateTime":
                  val = val?val:undefined
                  break
                case "LookupMulti":
                  // if(typeof(!col.async) === 'undefined')
                  //   val = {"results": val.filter(el=> Number.isInteger(el)) }
                  // else
                    val = {"results": val?val.map(el => el.value):[] }
                    key+="Id"
                  break
                case "Lookup":
                  key+="Id"
                  if(typeof(val) == 'object')val = val?val.value:undefined
                  else if(!val)val = undefined
                  break
                case "UserMulti":
                  val = {"results": val?val.map(el => el.value):[] }
                  key+="Id"
                  break
                case "User":
                  key+="Id"
                  val = val?val.value:undefined
                  break
                case "Number":
                    val = val?val:undefined
                    break
              }
              if(val !== null && val !== undefined && col && col.type != 'Counter' && col.type != 'Computed' )
                saveObject = Object.assign({}, saveObject, { [key]: val})
        }
        return saveObject
    }

    const saveForm = async ()=>{
      if(!formStore.columns)throw "Form not initialize ?"
      const listItemType = await getListItemType(listName)
      let saveObject:any = generateSaveObject(formStore.formData,formStore.columns)
      saveObject.__metadata = listItemType
      if(itemId){
        saveObject.ID = itemId
        await axios.post(mainUrl +"/_api/web/lists/getByTitle('"+listName+"')/items(" + itemId + ")",JSON.stringify(saveObject),{ headers: mainStore.updateHeaders})
      }else{
        const response = await axios.post(mainUrl +"/_api/web/lists/getByTitle('"+listName+"')/items",JSON.stringify(saveObject),{ headers: mainStore.createHeaders})
        //console.log(response.data.d.Id)
        itemId = response.data.d.Id
      }
      return itemId
    }

    const saveAttachments = async ()=>{
      if(!itemId)throw "item id missing ?"
      for(let filesInput of formStore.filesToUpload)
      for(let file of filesInput){
        await new Promise(r => setTimeout(r, 500))
        let encodedFileName = encodeURIComponent(file.name).replace(/'/g, '%27%27')
        let buffer = await getFileBuffer(file)
        await axios.post(mainUrl +"/_api/web/lists/getByTitle('"+listName+"')/items(" + itemId + ")/AttachmentFiles/add(FileName='" + encodedFileName + "')",buffer,{ headers: mainStore.createHeaders})
      }
    }

    const removeAttachments = async ()=>{
      if(!itemId)throw "item id missing ?"
      for(let fileName of formStore.filesToRemove){
        let encodedFileName = encodeURIComponent(fileName).replace(/'/g, '%27%27')
        await axios.delete(mainUrl +"/_api/web/lists/getByTitle('"+listName+"')/items(" + itemId + ")/AttachmentFiles('"+ encodedFileName +"')",{headers: mainStore.deleteHeaders})
      }
    }

    const saveDataIterator = async (dataIterator)=>{
      const listItemType = await getListItemType(dataIterator.props.listName)
      
      for(let item of dataIterator.mainItems){
        let saveObject:any = generateSaveObject(item,dataIterator.columns)
        saveObject.__metadata = listItemType
        if(item.id != -1){
          saveObject.ID = item.id
          await axios.post(mainUrl +"/_api/web/lists/getByTitle('"+dataIterator.props.listName+"')/items(" + item.id + ")",JSON.stringify(saveObject),{ headers: mainStore.updateHeaders})
        }
        else{
          saveObject[dataIterator.props.lookupColumn] = itemId
          await axios.post(mainUrl +"/_api/web/lists/getByTitle('"+dataIterator.props.listName+"')/items",JSON.stringify(saveObject),{ headers: mainStore.createHeaders})
        }
      }
      for(let id of dataIterator.deletedItems)
        await axios.delete(mainUrl +"/_api/web/lists/getByTitle('"+dataIterator.props.listName+"')/items(" + id + ")",{ headers: mainStore.deleteHeaders})

    }

    const saveEverything = async(dataIterators?:Array<any>)=>{
      saving.value = true
      try {
        await saveForm()
        await saveAttachments()
        await removeAttachments()
        if(dataIterators)
          for(const dataIterator of dataIterators)
            await saveDataIterator(dataIterator)
      } catch (error) {
        if(error)
          mainStore.setAlert('red',JSON.stringify(error))
        return false
      } finally {
        saving.value = false
      }
      return true
    }



  return { saveEverything, saving }
}

export default useFormSave