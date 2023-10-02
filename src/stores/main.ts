import { defineStore } from "pinia";
import { ref, inject, computed } from "vue";
import axios from "axios";
export const useMainStore = defineStore("main", () => { 
    const mainUrl = inject('$mainUrl')
    let formDigestValue = ref(null)
    const getFormDigest = async ()=>{
        const response = await axios.post(mainUrl +'/_api/contextinfo', {
            headers: {accept: 'application/json; odata=verbose'}
        })
        //console.log(response)
        formDigestValue.value = response.data.FormDigestValue
        setTimeout(getFormDigest, response.data.FormDigestTimeoutSeconds * 1000)
    }

    const alert = ref<boolean>(false)
    const alertColor = ref<string>("error")
    const alertText = ref<string>()
    const setAlert = (color:string,text:string)=>{
        alertText.value = text
        alertColor.value = color
        alert.value = true
    }
    
    const updateHeaders = computed(()=>{
        return {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE",
            "X-RequestDigest": formDigestValue.value
        }
    })
    const createHeaders = computed(()=>{
        return {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": formDigestValue.value
        }
    })
    const deleteHeaders = computed(()=>{
        return {
            "X-HTTP-Method": "DELETE",
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": formDigestValue.value
        }
    })

    return {formDigestValue, getFormDigest, updateHeaders, createHeaders, deleteHeaders, alert, alertColor, alertText, setAlert}
})