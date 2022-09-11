<template>
    <div ref="el">
        <nodeHeader  title="Number"/>
        <el-input v-model="url" df-url placeholder="Please number input" size="small">
        </el-input>
    </div>
</template>

<script>
import { defineComponent, onMounted, getCurrentInstance, ref, nextTick } from 'vue'
import nodeHeader from './nodeHeader.vue'

export default defineComponent({
    components: {
        nodeHeader
    },
    setup() {
        const el = ref(null);
        const nodeId = ref(0);
        let df = null
        const url = ref('');
        const method = ref('get');
        const dataNode = ref({});
        
        df = getCurrentInstance().appContext.config.globalProperties.$df.value;

        const updateSelect = (value) => {
            dataNode.value.data.method = value;
            df.updateNodeDataFromId(nodeId.value, dataNode.value);
        }
        
        
        onMounted(async () => {
            await nextTick()
            nodeId.value = el.value.parentElement.parentElement.id.slice(5)
            dataNode.value = df.getNodeFromId(nodeId.value)
            
            url.value = dataNode.value.data.url;
            method.value = dataNode.value.data.method;
        });
        
        return {
            el, url, method, updateSelect
        }

    }    
    
})
</script>
