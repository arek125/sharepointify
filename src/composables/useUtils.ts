
import { inject } from "vue";
import axios from "axios";
import dayjs from 'dayjs'

import type { columnInfoI } from '@/types'

const useUtils = () => {
  const window:any = inject('$window')
  const mainUrl = inject('$mainUrl')

  const openExternalLink = (path:String) => {
    window.open(path, '_blank')
  }

  const parseJsonTofield = (jsonData, col:columnInfoI)=>{
      let val:any = null
      switch(col.type){
          case "Lookup": if(jsonData){
              val = {title: jsonData.Title, value: jsonData.Id}
            } break;
            case "LookupMulti": if(jsonData)val = jsonData.map(el=>Object({title: el.Title, value: el.Id}));else val = [];
              break;
            case "MultiChoice": if(jsonData)val = jsonData.results;else val = []; break;
            case "DateTime": if(jsonData)col.format == "DateTime"?val = dayjs(jsonData).format("YYYY-MM-DDTHH:mm"):val = dayjs(jsonData).format("YYYY-MM-DD"); break;
            case "User": if(jsonData){
              val = {title: jsonData.Title, value: jsonData.Id}
              } break
            case "UserMulti": if(jsonData)val = jsonData.map(el=>Object({title: el.Title, value: el.Id}));else val = []; break;
            case "Note":if(jsonData)val = jsonData.replace(/<\/?[^>]+(>|$)/g, "");break;
            default: if(jsonData !== undefined && jsonData !== null)val = jsonData
      }
      return val
  }

  const getListItemType = async (listName:String)=>{
    const result = await axios.get(mainUrl +"/_api/web/lists/getbytitle('"+listName+"')/?$select=ListItemEntityTypeFullName")
    if (result.data) return {"type":result.data.ListItemEntityTypeFullName }
    else throw 'Invalid result!'
  }

  const getFileBuffer = (file) => {
    return new Promise((resolve,reject)=>{
      let reader = new FileReader();
      reader.onload = e=> resolve(e.target?.result)
      reader.onerror = e=> reject(e.target?.error)
      reader.readAsArrayBuffer(file)
    })
  }

  const getListColumnsInfo = async (listName:string) => {
    const response = await axios.get(mainUrl +"/_api/web/lists/getbytitle('"+listName+"')/fields?$filter=Hidden eq false")
    const parser = new DOMParser()
    let columns:columnInfoI[] = []
    for (let colInfo of response.data.value){
        const doc = parser.parseFromString(colInfo.SchemaXml, "application/xml")
        const field = doc.getElementsByTagName("Field")[0]
        columns.push({
            staticName: colInfo["StaticName"],
            label: colInfo["Title"],
            defaultValue: colInfo["DefaultValue"],
            required: colInfo["Required"],
            type: field.getAttribute("Type"),
            format: field.getAttribute("Format") || field.getAttribute("RichTextMode"),
            userSelectionScope: field.getAttribute("UserSelectionScope"),
            userSelectionMode: field.getAttribute("UserSelectionMode"),
            choices: colInfo?.Choices,
            lookupField: colInfo["LookupField"],
            lookupList: colInfo["LookupList"]?colInfo["LookupList"].replaceAll(/{|}/g,""):null
        })
    }
    return columns
}

  const parseColVal = (colType?:string,val?:any,colFormat?:string|null) => {
    if(val)
      if(colType == "User" ||colType == "Lookup" ||colType == "LookupTask")return val.Title
      else if((colType == "UserMulti"|| colType == "LookupMulti") && Array.isArray(val))return val.map(x=>x.Title).join(', ')
      else if(colType == "Number" && colFormat == "Currency")return parseFloat(val).toFixed(2)
      else if(colType == "Number")return parseFloat(val)
      else if(colType == "Calculated")return val
      else if(colType == "DateTime" || colFormat=="DateOnly")return new Date(val).toLocaleString('pl-PL',{dateStyle: 'short',timeStyle: colFormat=="DateOnly"?undefined:'short',hour12: false});
      else return val
    else return val
  }

  return { parseJsonTofield, openExternalLink, getListItemType, getFileBuffer, getListColumnsInfo, parseColVal }
}

export default useUtils