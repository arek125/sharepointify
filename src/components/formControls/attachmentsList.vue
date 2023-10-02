<script setup lang="ts">
import type { PropType } from 'vue'
//import axios from 'axios';
import { ref, watch } from 'vue'
//import { useMainStore } from '@/stores/main'
import useUtils from '@/composables/useUtils'
//const mainStore = useMainStore()
const { openExternalLink } = useUtils()
const emit = defineEmits(['update:filesToRemove'])
//const mainUrl = inject('$mainUrl')
const props = defineProps({
    // colInfo: { type: Object as PropType<columnInfoI>, required: true},
    // rules: { type: Array as PropType<any[]> },
    disabled: { type: Boolean, required: false, default: false },
    savedFiles:  { type: Array as PropType<any[]> },
    // itemId: {type: String, required: true},
    // listName: { type: String, required: true }
})

const filesToRemove = ref<string[]>([])

// const removeAttachment = async (fileName)=>{
//     let encodedFileName = encodeURIComponent(fileName).replace(/'/g, '%27%27')
//     const response = await axios.delete(mainUrl +"/_api/web/lists/getByTitle('"+props.listName+"')/items(" + props.itemId + ")/AttachmentFiles('"+ encodedFileName +"')",{
//         headers: {
//             'X-RequestDigest': mainStore.formDigestValue,
//         }
//     })
//     return response
// }
watch(filesToRemove.value,(val)=>{
    emit('update:filesToRemove', val)
})

const restore = (FileName)=>{
    const index = filesToRemove.value.indexOf(FileName)
    filesToRemove.value.splice(index,1)
}

const fileInArray = (FileName)=>{
    return filesToRemove.value.includes(FileName)
}

</script>

<template>
    <v-list lines="one">
      <v-list-item
        v-for="file in props.savedFiles"
        :key="file.FileName"
      >
        <v-list-item-title v-text="file.FileName" :style="{'text-decoration': fileInArray(file.FileName)?'line-through':'auto'}"></v-list-item-title>
        <template v-slot:prepend>
          <v-avatar :color="file.color">
            <v-icon color="primary">mdi-attachment</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
            <v-btn
            color="grey-lighten-1"
            icon="mdi-open-in-new"
            variant="text"
            @click="openExternalLink(file.ServerRelativeUrl)"
          ></v-btn>
          <v-btn
            color="grey-lighten-1"
            icon="mdi-delete"
            variant="text"
            @click="fileInArray(file.FileName)?restore(file):filesToRemove.push(file.FileName)"
          ></v-btn>
        </template>
      </v-list-item>
    </v-list>
</template>