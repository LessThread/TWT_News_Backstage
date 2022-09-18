import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './utils/rem'
import '@/utils/global_styles/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createAlignPlugin from '@kangc/v-md-editor/lib/plugins/align';

import Prism from 'prismjs';

VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
VMdPreview.use(vuepressTheme, {
  Prism,
});

VueMarkdownEditor.use(createAlignPlugin());
VMdPreview.use(createAlignPlugin());

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(VueMarkdownEditor)
app.use(VMdPreview)
app.use(router)
app.mount('#app')

