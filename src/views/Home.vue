<script setup lang="ts">
// import listform from '../components/listForm.vue'
import listTable from '../components/listTable.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

</script>
<template>
    <v-container fluid>
        <listTable listName="Lista Testowa" :tableHeadersInit="[
            { key: 'Id', title: 'Id', align: ' d-none' },
            { key: 'actions',title: 'Actions', sortable: false },
            { key: 'Title' },
            { key: 'PackedDate' },
            { key: 'Liczby' }
        ]" :actions="[{
                icon: 'mdi-text-box',
                color: 'primary',
                hintText: 'Open',
                click: (item)=>{
                    router.push({ name: 'form', params: {id: item.Id }})
                }
            }
        ]"/>
    </v-container>
</template>