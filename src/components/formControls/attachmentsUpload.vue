<script setup lang="ts">
import { ref, watch } from 'vue'
const emit = defineEmits(['update:filesToUpload'])
//const mainUrl = inject('$mainUrl')
const props = defineProps({
    // colInfo: { type: Object as PropType<columnInfoI>, required: true},
    // rules: { type: Array as PropType<any[]> },
    disabled: { type: Boolean, required: false, default: false },
    //savedFiles:  { type: Array as PropType<any[]> },
    // itemId: {type: String, required: true},
    // listName: { type: String, required: true }
})

const filesToUpload = ref<any[]>([])

watch(filesToUpload.value,(val)=>{
    emit('update:filesToUpload', val)
})


</script>

<template>
        <v-row v-if="!props.disabled">
          <v-col cols="12" lg="6" v-for="(filesInput,index) in filesToUpload" :key="index" >
            <v-file-input
              v-model="filesToUpload[index]"
              :label="'Attachments '+ (index +1)"
              multiple
              prepend-icon="mdi-paperclip"
              append-outer-icon="mdi-delete"
              @click:append-outer="filesToUpload.splice(index, 1)"
              small-chips
            >
            </v-file-input>
          </v-col>
          <v-col cols="6">
              <v-btn
                  color="primary"
                  @click="filesToUpload.push([])"
                  tile
              ><v-icon left>
                mdi-paperclip
              </v-icon>Add next attachments
              </v-btn>
            </v-col>
        </v-row>
</template>