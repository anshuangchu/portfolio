<template>
  <div class="editor-page">
    <header class="editor-header">
      <div class="editor-header-inner">
        <router-link to="/" class="editor-brand">安双初 · 技术笔记</router-link>
        <div class="editor-header-right">
          <router-link to="/admin" class="back-link">返回</router-link>
          <button class="btn-save" @click="saveDraft" :disabled="saving">
            {{ saving ? '保存中...' : '保存草稿' }}
          </button>
          <button class="btn-publish" @click="publish" :disabled="saving">
            {{ saving ? '发布中...' : '发布' }}
          </button>
        </div>
      </div>
    </header>

    <main class="editor-main">
      <p v-if="error" class="error-msg">{{ error }}</p>
      <p v-if="success" class="success-msg">{{ success }}</p>

      <!-- Metadata -->
      <div class="meta-fields">
        <input
          v-model="title"
          class="title-input"
          placeholder="文章标题"
          type="text"
        />
        <div class="meta-row">
          <select v-model="category" class="meta-select">
            <option value="">选择分类</option>
            <option value="AI / 大模型">AI / 大模型</option>
            <option value="编程开发">编程开发</option>
            <option value="嵌入式 / 硬件">嵌入式 / 硬件</option>
          </select>
          <input
            v-model="tagsInput"
            class="meta-input"
            placeholder="标签（逗号分隔）"
            type="text"
          />
        </div>
      </div>

      <!-- Editor Toolbar -->
      <div v-if="editor" class="toolbar">
        <button @click="editor.chain().focus().toggleBold().run()" :class="{ active: editor.isActive('bold') }" title="加粗"><strong>B</strong></button>
        <button @click="editor.chain().focus().toggleItalic().run()" :class="{ active: editor.isActive('italic') }" title="斜体"><em>I</em></button>
        <button @click="editor.chain().focus().toggleStrike().run()" :class="{ active: editor.isActive('strike') }" title="删除线"><s>S</s></button>
        <span class="sep"></span>
        <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ active: editor.isActive('heading', { level: 2 }) }" title="二级标题">H2</button>
        <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ active: editor.isActive('heading', { level: 3 }) }" title="三级标题">H3</button>
        <span class="sep"></span>
        <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ active: editor.isActive('bulletList') }" title="无序列表">&#x2022; list</button>
        <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ active: editor.isActive('orderedList') }" title="有序列表">1. list</button>
        <span class="sep"></span>
        <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ active: editor.isActive('blockquote') }" title="引用">&#x201C; quote</button>
        <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ active: editor.isActive('codeBlock') }" title="代码块">&lt;/&gt;</button>
        <span class="sep"></span>
        <button @click="addLink" :class="{ active: editor.isActive('link') }" title="链接">&#x1F517;</button>
        <button @click="addImage" title="图片">&#x1F5BC;</button>
      </div>

      <!-- Editor Content -->
      <div class="editor-wrapper">
        <editor-content :editor="editor" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { authStore } from '../stores/auth.js'
import { api } from '../api/client.js'
import { marked } from 'marked'

const router = useRouter()
const route = useRoute()

const postId = route.params.id
const isEdit = !!postId

const title = ref('')
const category = ref('')
const tagsInput = ref('')
const error = ref('')
const success = ref('')
const saving = ref(false)

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    Image.configure({ inline: true }),
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: '开始写文章...' }),
  ],
  editorProps: {
    attributes: { class: 'prose-content' },
  },
})

onMounted(async () => {
  await authStore.fetchMe()
  if (!authStore.user) {
    router.push('/login')
    return
  }
  if (isEdit) {
    await loadPost()
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

async function loadPost() {
  try {
    const post = await api(`/posts/${postId}`)
    title.value = post.title
    category.value = post.category
    tagsInput.value = (post.tags || []).join(', ')
    editor.value?.commands.setContent(post.content)
  } catch (e) {
    error.value = e.message
  }
}

function addLink() {
  const url = prompt('输入链接地址:')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

function addImage() {
  const url = prompt('输入图片地址:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

function getExcerpt(html, len = 120) {
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return text.length > len ? text.slice(0, len) + '...' : text
}

async function saveDraft() {
  await save(false)
}

async function publish() {
  if (!title.value || !category.value) {
    error.value = '请填写标题和分类'
    return
  }
  await save(true)
}

async function save(published) {
  error.value = ''
  success.value = ''
  saving.value = true

  const content = editor.value?.getHTML() || ''
  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)

  const categoryColors = {
    'AI / 大模型': '#6c5ce7',
    '编程开发': '#00cec9',
    '嵌入式 / 硬件': '#fd79a8',
  }

  const body = {
    title: title.value,
    content,
    excerpt: getExcerpt(content),
    category: category.value,
    category_color: categoryColors[category.value] || '#6c5ce7',
    tags,
    published,
  }

  try {
    if (isEdit) {
      await api(`/posts/${postId}`, { method: 'PUT', body: JSON.stringify(body) })
      success.value = '已保存'
    } else {
      const result = await api('/posts', { method: 'POST', body: JSON.stringify(body) })
      router.push(`/admin/edit/${result.id}`)
      success.value = '已创建'
    }
  } catch (e) {
    error.value = e.message
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.editor-page {
  min-height: 100vh;
  background: var(--dark);
}

.editor-header {
  border-bottom: 1px solid var(--card-border);
  padding: 12px 24px;
  position: sticky;
  top: 0;
  background: var(--dark);
  z-index: 10;
}

.editor-header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-brand {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
}

.editor-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-link {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--primary-light);
}

.btn-save {
  padding: 8px 20px;
  border: 1px solid var(--card-border);
  border-radius: 8px;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-save:hover {
  border-color: var(--primary);
  color: var(--primary-light);
}

.btn-publish {
  padding: 8px 20px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-publish:hover {
  opacity: 0.9;
}

.btn-save:disabled, .btn-publish:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-main {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 32px 24px 80px;
}

.error-msg {
  color: var(--accent2);
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.success-msg {
  color: var(--accent);
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.meta-fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.title-input {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  background: none;
  border: none;
  outline: none;
  padding: 0;
  width: 100%;
}

.title-input::placeholder {
  color: rgba(255,255,255,0.2);
}

.meta-row {
  display: flex;
  gap: 12px;
}

.meta-select, .meta-input {
  padding: 10px 14px;
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.04);
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
}

.meta-select { min-width: 140px; }
.meta-input { flex: 1; }

.meta-select:focus, .meta-input:focus {
  border-color: var(--primary);
}

.meta-select option {
  background: var(--dark2);
  color: var(--text);
}

/* Toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  background: rgba(255,255,255,0.03);
}

.toolbar button {
  padding: 6px 10px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: none;
  color: var(--text-muted);
  font-size: 0.82rem;
  cursor: pointer;
  transition: var(--transition);
  line-height: 1;
}

.toolbar button:hover {
  background: rgba(255,255,255,0.06);
  color: #fff;
}

.toolbar button.active {
  background: rgba(108, 92, 231, 0.2);
  color: var(--primary-light);
  border-color: var(--primary);
}

.sep {
  width: 1px;
  height: 22px;
  background: var(--card-border);
  margin: 0 4px;
}

/* Editor wrapper */
.editor-wrapper {
  border: 1px solid var(--card-border);
  border-top: none;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  padding: 24px 28px;
  min-height: 400px;
}

:deep(.ProseMirror) {
  outline: none;
  min-height: 360px;
  color: var(--text);
  line-height: 1.8;
}

:deep(.ProseMirror p) {
  margin: 8px 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 24px 0 12px;
}

:deep(.ProseMirror h3) {
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
  margin: 20px 0 8px;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 24px;
  margin: 8px 0;
}

:deep(.ProseMirror li) {
  margin: 4px 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 3px solid var(--primary);
  padding: 8px 16px;
  margin: 12px 0;
  color: var(--text-muted);
  font-style: italic;
  background: rgba(108, 92, 231, 0.05);
  border-radius: 0 8px 8px 0;
}

:deep(.ProseMirror pre) {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-sm);
  padding: 16px;
  margin: 12px 0;
  overflow-x: auto;
}

:deep(.ProseMirror code) {
  font-family: 'Fira Code', 'Cascadia Code', monospace;
  font-size: 0.88rem;
  color: var(--accent);
}

:deep(.ProseMirror pre code) {
  color: var(--text);
}

:deep(.ProseMirror img) {
  max-width: 100%;
  border-radius: var(--radius-sm);
  margin: 12px 0;
}

:deep(.ProseMirror a) {
  color: var(--accent);
  text-decoration: underline;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: rgba(255,255,255,0.15);
  pointer-events: none;
  float: left;
  height: 0;
}

@media (max-width: 640px) {
  .meta-row { flex-direction: column; }
  .title-input { font-size: 1.4rem; }
  .editor-wrapper { padding: 16px; }
}
</style>
