const NAV_DEBOUNCE_TIME = 200
const recentClicks = new Set()
const parser = new DOMParser()
const inFlightRequests = new Map()

let historyStateReplaced = false
let requestCount = 0

let onError = (error) => { throw error }
let busyClass = 'bx-busy'
let headContentSelectors = [
  'title',
  'meta[name]',
  'meta[property]',
  'link[rel="canonical"]',
  'link[rel="alternate"]',
  'script[type="application/ld+json"]'
]

const submitPipeline = async (e) => {
  try {
    const ctx = getSubmitContext(e)
    if (!ctx) return
    const requestCoordination = getRequestCoordination(ctx.target.el)
    if (requestCoordination.abortThis) return
    requestCoordination.toAbort.forEach(c => c.abort())
    const requestId = getRequestId()
    try {
      updateForm(ctx.form, requestId, disableElement)
      startUiFeedback(ctx.target.el, requestId)
      inFlightRequests.set(ctx.target.el, ctx.abortController)
      const response = await fetchContent(ctx.request, ctx.target)
      const loadedContent = await loadContent(ctx.target.el, response.content)
      if(loadedContent && ctx.target.type === 'bx-nav-pane') {
        updateHead(response.newHead)
        updateHistory(response.finalUrl, ctx.target.name)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error
      }
    } finally {
      inFlightRequests.delete(ctx.target.el)
      endUiFeedback(ctx.target.el, requestId)
      updateForm(ctx.form, requestId, enableElement)
    }
  } catch (error) {
    onError(error)
  }
}

const clickPipeline = async (e) => {
  try {
    const ctx = getClickContext(e)
    if (!ctx) return
    const requestCoordination = getRequestCoordination(ctx.target.el)
    if (requestCoordination.abortThis) return
    requestCoordination.toAbort.forEach(c => c.abort())
    const requestId = getRequestId()
    try {
      startUiFeedback(ctx.target.el, requestId)
      inFlightRequests.set(ctx.target.el, ctx.abortController)
      const response = await fetchContent(ctx.request, ctx.target)
      const loadedContent = await loadContent(ctx.target.el, response.content)
      if(loadedContent && ctx.target.type === 'bx-nav-pane') {
        updateHead(response.newHead)
        updateHistory(response.finalUrl, ctx.target.name)
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error
      }
    } finally {
      inFlightRequests.delete(ctx.target.el)
      endUiFeedback(ctx.target.el, requestId)
    }
  } catch (error) {
    onError(error)
  }
}

const popstatePipeline = async (e) => {
  try {
    const ctx = getPopStateContext(e)
    if (!ctx) return
    const requestId = getRequestId()
    try {
      startUiFeedback(ctx.target.el, requestId)
      inFlightRequests.set(ctx.target.el, ctx.abortController)
      const response = await fetchContent(ctx.request, ctx.target)
      const loadedContent = await loadContent(ctx.target.el, response.content)
      if(loadedContent) updateHead(response.newHead)
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error
      }
    } finally {
      inFlightRequests.delete(ctx.target.el)
      endUiFeedback(ctx.target.el, requestId)
    }
  } catch (error) {
    onError(error)
  }
}

const getSubmitContext = (e) => {
  const targetName = e.submitter?.getAttribute('bx-target') || e.target.getAttribute('bx-target')
  if (!targetName) return
  e.preventDefault()
  const target = getTarget(targetName)
  const method = (e.submitter?.getAttribute('formmethod') || e.target.getAttribute('method') || 'GET').toUpperCase()
  const action = e.submitter?.getAttribute('formaction') || e.target.getAttribute('action') || window.location.href
  const formData = new FormData(e.target, e.submitter)
  const abortController = new AbortController()
  const request = (method === 'GET')
    ? buildGetRequest(action, formData, abortController)
    : new Request(action, { method, body: formData, signal: abortController.signal })
  return { request, target, form: e.target, abortController }
}

const buildGetRequest = (action, formData, abortController) => {
  const url = new URL(action, window.location.origin)
  const params = new URLSearchParams(formData)
  if (params.size) url.search = '?' + params.toString()
  return new Request(url.href, { signal: abortController.signal })
}

const getClickContext = (e) => {
  if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) return // Modifiers to open a link in a new tab
  const link = e.target.closest('a[bx-target]')
  if (!link) return
  e.preventDefault()
  const hasRecentClick = recentClicks.has(link)
  if (hasRecentClick) return
  recentClicks.add(link)
  setTimeout(() => recentClicks.delete(link), NAV_DEBOUNCE_TIME)
  if (new URL(link.href).origin !== window.location.origin) throw new Error('Bixi error: Cannot progressively enhance external links')
  if (link.hasAttribute('target')) throw new Error('Bixi error: Cannot progressively enhance links with target attribute')
  const target = getTarget(link.getAttribute('bx-target'))
  const abortController = new AbortController()
  const request = new Request(link.href, { signal: abortController.signal })
  return { request, target, abortController }
}

const getRequestId = () => {
  requestCount++
  return requestCount
}

const getRequestCoordination = (el) => {
  const toAbort = []
  for (const [otherTarget, controller] of inFlightRequests.entries()) {
    if (controller.signal.aborted) continue
    if (el === otherTarget || el.contains(otherTarget)) {
      toAbort.push(controller)
    } else if (otherTarget.contains(el)) {
      return { abortThis: true } // Parent request is in flight, skip this one
    }
  }
  return { toAbort }
}

const updateForm = (form, requestId, func) => {
  updateInteractiveElements(form, requestId, func)
  if (form.id) document.querySelectorAll(`[form="${form.id}"]`).forEach(el => func(el, requestId))
}

const updateInteractiveElements = (container, requestId, func) => {
  container.querySelectorAll('input, button, select, textarea')
    .forEach(el => func(el, requestId))
}

const disableElement = (el, requestId) => {
  if (!el.disabled || el.hasAttribute('data-bixi-disabled')) {
    el.disabled = true
    el.setAttribute('data-bixi-disabled', requestId)
    el.setAttribute('aria-disabled', 'true')
  }
}

const enableElement = (el, requestId) => {
  if (parseInt(el.dataset.bixiDisabled) === requestId) {
    el.disabled = false
    el.removeAttribute('data-bixi-disabled')
    el.removeAttribute('aria-disabled')
  }
}

const startUiFeedback = (el, requestId) => {
  updateInteractiveElements(el, requestId, disableElement)
  el.setAttribute('data-bixi-busy', requestId)
  el.classList.add(busyClass)
  el.setAttribute('aria-busy', 'true')
}

const endUiFeedback = (el, requestId) => {
  if(parseInt(el.dataset.bixiBusy) === requestId) {
    el.removeAttribute('aria-busy')
    el.classList.remove(busyClass)
    el.removeAttribute('data-bixi-busy')
    updateInteractiveElements(el, requestId, enableElement)
  }
}

const fetchContent = async (request, target) => {
  request.headers.append('X-Bixi-Target', target.name)
  const response = await fetch(request)
  const responseHTML = await response.text()
  const parsedDocument = parser.parseFromString(responseHTML, 'text/html')
  const candidates = parsedDocument.querySelectorAll(`[${target.type}="${target.name}"]`)
  if (candidates.length === 0) throw new Error(`Bixi error: No ${target.type} named ${target.name} found in server response`)
  if (candidates.length > 1) throw new Error(`Bixi error: Multiple ${target.type}s named ${target.name} found in server response`)
  return { content: candidates[0], finalUrl: response.url, newHead: parsedDocument.head }
}

const getTarget = (targetName) => {
  const candidates = document.querySelectorAll(`[bx-pane="${targetName}"],[bx-nav-pane="${targetName}"]`)
  if (candidates.length === 0) throw new Error(`Bixi error: No pane named ${targetName} found in current document`)
  if (candidates.length > 1) throw new Error(`Bixi error: Multiple panes named ${targetName} found in current document`)
  const el = candidates[0]
  const type = el.hasAttribute('bx-pane') ? 'bx-pane' : 'bx-nav-pane'
  return { el, name: targetName, type }
}

const loadContent = async (el, newContent) => {
  const beforeEvent = new CustomEvent('bixi:beforeLoadContent', {
    detail: { newContent },
    cancelable: true,
    bubbles: true
  })
  el.dispatchEvent(beforeEvent)
  if (beforeEvent.defaultPrevented) return
  let loadedContent
  if (document.startViewTransition) {
    await document.startViewTransition(() => loadedContent = swapContent(el, newContent)).finished
  } else {
    loadedContent = swapContent(el, newContent)
  }
  const autoFocusEl = loadedContent.querySelector('[autofocus]')
  if (autoFocusEl) {
    autoFocusEl.focus()
    autoFocusEl.removeAttribute('autofocus')
  }
  const afterEvent = new CustomEvent('bixi:afterLoadContent', { bubbles: true })
  loadedContent.dispatchEvent(afterEvent)
  return loadedContent
}

const updateHistory = (url, paneName) => {
  if (!historyStateReplaced) {
    history.replaceState({ paneName, url: window.location.href }, '', window.location.href)
    historyStateReplaced = true
  }
  history.pushState({ paneName, url }, '', url)
}

const updateHead = (newHead) => {
  if(newHead) {
    headContentSelectors.forEach(selector => {
      document.head.querySelectorAll(selector).forEach(el => el.remove())
      newHead.querySelectorAll(selector).forEach(tag => {
        document.head.appendChild(tag.cloneNode(true))
      })
    })
  }
}

const swapContent = (el, newContent) => {
  const importedNode = document.importNode(newContent, true)
  el.replaceWith(importedNode)
  return importedNode
}

const getPopStateContext = (e) => {
  if (!e.state) return

  // Cancel all in-flight requests, regardless of target
  inFlightRequests.forEach(controller => controller.abort())
  inFlightRequests.clear()

  const { paneName, url } = e.state
  const target = getTarget(paneName)
  const abortController = new AbortController()
  const request = new Request(url, { signal: abortController.signal })
  return { request, target, abortController }
}

export function init(config) {
  onError = config?.onError ?? onError
  busyClass = config?.busyClass ?? busyClass
  headContentSelectors = config?.headContentSelectors ?? headContentSelectors
  document.addEventListener('click', clickPipeline)
  document.addEventListener('submit', submitPipeline)
  window.addEventListener('popstate', popstatePipeline)
}

export function destroy() {
  document.removeEventListener('click', clickPipeline)
  document.removeEventListener('submit', submitPipeline)
  window.removeEventListener('popstate', popstatePipeline)
}
