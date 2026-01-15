/**
 * Syllabus Parser - Frontend Application
 */

const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => document.querySelectorAll(sel)

// State
let state = {
  extracted: null,
  markdown: '',
  models: [],
  hasServerKey: false
}

// Elements
const els = {
  dropzone: $('#dropzone'),
  fileInput: $('#file-input'),
  apiKeyField: $('#api-key-field'),
  apiKey: $('#api-key'),
  saveKey: $('#save-key'),
  model: $('#model'),
  progress: $('#progress'),
  progressLabel: $('#progress-label'),
  results: $('#results'),
  courseName: $('#course-name'),
  courseMeta: $('#course-meta'),
  eventsBody: $('#events-body'),
  stats: $('#stats'),
  rawPanel: $('#raw-panel'),
  rawContent: $('#raw-content'),
  modelUsed: $('#model-used'),
  downloadBtn: $('#download-md'),
  toggleRaw: $('#toggle-raw'),
  clearBtn: $('#clear'),
  errorContainer: $('#error-container')
}

// Initialize
async function init() {
  // Check if server has API key configured
  await checkServerConfig()

  // Restore saved API key (only if server doesn't have one)
  if (!state.hasServerKey) {
    const savedKey = localStorage.getItem('openrouter_key')
    if (savedKey) els.apiKey.value = savedKey
  }

  // Load models
  await loadModels()

  // Restore saved model
  const savedModel = localStorage.getItem('selected_model')
  if (savedModel) els.model.value = savedModel

  // Bind events
  bindEvents()
}

async function checkServerConfig() {
  try {
    const res = await fetch('/api/config')
    if (!res.ok) throw new Error('Config fetch failed')
    const config = await res.json()
    state.hasServerKey = config.hasServerKey

    // Hide API key field if server has key
    if (state.hasServerKey && els.apiKeyField) {
      els.apiKeyField.classList.add('hidden')
    }
  } catch {
    state.hasServerKey = false
  }
}

async function loadModels() {
  try {
    const res = await fetch('/api/models')
    if (!res.ok) throw new Error('Models fetch failed')
    state.models = await res.json()
  } catch {
    state.models = [
      { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (1M ctx)' },
      { id: 'xiaomi/mimo-v2-flash:free', name: 'MiMo V2 Flash (256K ctx)' },
      { id: 'deepseek/deepseek-r1-0528:free', name: 'DeepSeek R1 (164K ctx)' }
    ]
  }

  els.model.innerHTML = state.models
    .map((m, i) => `<option value="${m.id}"${i === 0 ? ' selected' : ''}>${m.name}</option>`)
    .join('')
}

function bindEvents() {
  // Save API key
  if (els.saveKey) {
    els.saveKey.onclick = () => {
      localStorage.setItem('openrouter_key', els.apiKey.value)
      toast('API key saved', 'success')
    }
  }

  // Save model preference
  els.model.onchange = () => {
    localStorage.setItem('selected_model', els.model.value)
  }

  // Dropzone interactions
  els.dropzone.onclick = () => els.fileInput.click()

  els.dropzone.ondragover = (e) => {
    e.preventDefault()
    els.dropzone.classList.add('active')
  }

  els.dropzone.ondragleave = (e) => {
    e.preventDefault()
    els.dropzone.classList.remove('active')
  }

  els.dropzone.ondrop = (e) => {
    e.preventDefault()
    els.dropzone.classList.remove('active')
    const file = e.dataTransfer.files[0]
    if (file?.type === 'application/pdf') {
      processFile(file)
    } else {
      showError('Please drop a PDF file')
    }
  }

  els.fileInput.onchange = (e) => {
    if (e.target.files[0]) processFile(e.target.files[0])
  }

  // Result actions
  els.downloadBtn.onclick = downloadMarkdown
  els.toggleRaw.onclick = toggleRaw
  els.clearBtn.onclick = clearResults
}

async function processFile(file) {
  // Only require API key if server doesn't have one
  const apiKey = els.apiKey?.value?.trim() || ''
  if (!state.hasServerKey && !apiKey) {
    showError('Enter your OpenRouter API key first')
    return
  }

  clearError()
  els.results.classList.add('hidden')
  els.progress.classList.remove('hidden')
  els.progressLabel.textContent = 'Extracting text from PDF...'

  try {
    // Upload PDF
    const formData = new FormData()
    formData.append('file', file)

    const uploadRes = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!uploadRes.ok) {
      const text = await uploadRes.text()
      throw new Error(`Upload failed: ${uploadRes.status} - ${text.slice(0, 100)}`)
    }

    const uploadData = await uploadRes.json()

    if (!uploadData.success) {
      throw new Error(uploadData.error || 'Failed to parse PDF')
    }

    // Extract with AI
    const modelName = els.model.options[els.model.selectedIndex]?.text || ''
    els.progressLabel.textContent = `Analyzing with ${modelName}...`

    const extractRes = await fetch('/api/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: uploadData.text,
        model: els.model.value,
        apiKey // Server will use its key if available
      })
    })

    if (!extractRes.ok) {
      const text = await extractRes.text()
      throw new Error(`Extraction failed: ${extractRes.status} - ${text.slice(0, 100)}`)
    }

    const result = await extractRes.json()

    if (!result.success) {
      throw new Error(result.error || 'Extraction failed')
    }

    state.extracted = result.extracted
    state.markdown = result.markdown

    renderResults(result)

  } catch (err) {
    showError(err.message)
  } finally {
    els.progress.classList.add('hidden')
    els.fileInput.value = ''
  }
}

function renderResults(result) {
  els.results.classList.remove('hidden')

  const data = result.extracted || {}
  const events = data.events || []

  // Course info
  els.courseName.textContent = data.courseName || 'Untitled Course'
  els.courseMeta.textContent = `${data.instructor || 'Unknown'} · ${data.semester || 'Unknown'}`

  // Events table
  if (events.length === 0) {
    els.eventsBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: var(--text-dim); padding: 3rem;">
          No events found in this syllabus
        </td>
      </tr>
    `
  } else {
    els.eventsBody.innerHTML = events
      .map(e => `
        <tr>
          <td>${esc(e.dueDate || 'TBD')}</td>
          <td><span class="badge badge-${e.type || 'other'}">${esc(e.type || 'other')}</span></td>
          <td>${esc(e.title || '—')}</td>
          <td>${esc(e.weight || '—')}</td>
        </tr>
      `)
      .join('')
  }

  // Stats
  const usage = result.usage || {}
  els.stats.innerHTML = `
    <div class="stat">
      <span class="stat-value">${events.length}</span>
      <span class="stat-label">Events</span>
    </div>
    <div class="stat">
      <span class="stat-value">${formatModel(result.model)}</span>
      <span class="stat-label">Model</span>
    </div>
    <div class="stat">
      <span class="stat-value">${usage.total_tokens?.toLocaleString() || '—'}</span>
      <span class="stat-label">Tokens</span>
    </div>
  `

  // Raw response
  els.modelUsed.textContent = result.model || ''
  els.rawContent.textContent = JSON.stringify(result, null, 2)

  // Scroll to results
  els.results.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function downloadMarkdown() {
  if (!state.markdown) return

  const name = state.extracted?.courseName || 'syllabus'
  const filename = name.replace(/[^a-z0-9]/gi, '_') + '.md'

  const blob = new Blob([state.markdown], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)

  toast(`Downloaded ${filename}`, 'success')
}

function toggleRaw() {
  const hidden = els.rawPanel.classList.toggle('hidden')
  els.toggleRaw.textContent = hidden ? 'Raw' : 'Hide'
}

function clearResults() {
  els.results.classList.add('hidden')
  els.rawPanel.classList.add('hidden')
  els.toggleRaw.textContent = 'Raw'
  state.extracted = null
  state.markdown = ''
}

function showError(msg) {
  els.errorContainer.innerHTML = `<div class="error">${esc(msg)}</div>`
}

function clearError() {
  els.errorContainer.innerHTML = ''
}

function toast(msg, type = 'success') {
  const existing = $('.toast')
  if (existing) existing.remove()

  const el = document.createElement('div')
  el.className = `toast ${type}`
  el.textContent = msg
  document.body.appendChild(el)

  setTimeout(() => el.remove(), 3000)
}

function formatModel(model) {
  if (!model) return '—'
  const parts = model.split('/')
  return parts[parts.length - 1].split(':')[0]
}

function esc(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// Start
document.addEventListener('DOMContentLoaded', init)
