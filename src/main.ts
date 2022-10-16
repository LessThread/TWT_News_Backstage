import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './utils/rem'
import '@/utils/global_styles/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';

import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';

import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

VueMarkdownEditor.use(githubTheme, {
});

VueMarkdownEditor.use(createAlignPlugin());

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(VueMarkdownEditor)
app.use(router)
app.mount('#app')

