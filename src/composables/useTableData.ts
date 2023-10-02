import { ref,inject,computed } from "vue";
import axios from "axios";
// import dayjs from 'dayjs'

const useTableData = (listName:string, defaultSortBy:any[], mainFilter?:string)=>{
    const mainUrl = inject('$mainUrl')
    const items = ref<any[]>([])
    const nextPage = ref<string>('')
    const dataLoading = ref<boolean>(false)

    const selectColumnsData = ref<string[]>([])
    const expandColumnsData = ref<string[]>([])
    const currentSortBy = ref<any[]>(defaultSortBy)
    const currentFilter  = ref<string>('')

    const getSortQuery = (sortBy:any[])=>{
        return sortBy.map(x=>x.key+" "+x.order).join(",")
    }
    const fullFilter = computed(()=>{
        if(mainFilter && currentFilter.value)return `(${mainFilter}) and (${currentFilter.value})`
        else if(mainFilter)return mainFilter
        else if(currentFilter.value)return currentFilter.value
        else return ''
    })

    const getData = async (newPageURL?:string)=> {
        dataLoading.value = true
        const response = newPageURL?await axios.get(newPageURL):await axios.get(mainUrl +"/_api/web/lists/getbytitle('"+listName+"')/items",{
            params:{
                $expand: expandColumnsData.value.join(','),
                $select: selectColumnsData.value.join(','),
                $orderby: currentSortBy.value && currentSortBy.value.length?getSortQuery(currentSortBy.value):undefined,
                $filter: fullFilter.value?fullFilter.value:undefined,
                $top: 10
            }
        })
        if(response.data['odata.nextLink'])nextPage.value = response.data['odata.nextLink']
        else nextPage.value = ''
        if(newPageURL){
            const map = new Map()
            items.value.forEach(item => map.set(item.Id, item))
            response.data.value.forEach(item => map.set(item.Id, {...map.get(item.Id), ...item}))
            items.value = Array.from(map.values())
        }else items.value = response.data.value

        items.value = items.value.map(y=>{
          if('AttachmentFiles' in y)
            y.AttachmentFiles = y.AttachmentFiles.map(x=>Object.assign(x,{list: listName, id: x.ServerRelativeUrl, itemId: y.Id, title: y.Title, file: x.FileName.includes(".")?x.FileName.split(".").pop().toLowerCase():undefined}))
          return y
        })
        console.log(items.value)
        dataLoading.value = false
    }

    return { items, getData, nextPage, dataLoading, selectColumnsData, expandColumnsData, currentSortBy, currentFilter }
}
export default useTableData