const NAV_DEBOUNCE_TIME = 200
const recentClicks = new Set()
const parser = new DOMParser()
const inFlightRequests = new Map()

let historyStateReplaced = false

let onError = (error) => { throw error }
let busyClass = 'bx-busy'

const withTryAsync = async (func) => {
  try {
    await func()
  } catch (error) {
    onError(error)
  }
}

const tryInterceptSubmit = (e) => withTryAsync(() => interceptSubmit(e))

const interceptSubmit = async (e) => {
  const targetName = e.submitter?.getAttribute('bx-target') || e.target.getAttribute('bx-target')
  if (!targetName) return
  e.preventDefault()
  const target = getTarget(targetName)
  const method = (e.submitter?.getAttribute('formmethod') || e.target.getAttribute('method') || 'GET').toUpperCase()
  const action = e.submitter?.getAttribute('formaction') || e.target.getAttribute('action') || window.location.href
  const formData = new FormData(e.target, e.submitter)
  const { url, body } = (method === 'GET')
    ? buildGetRequest(action, formData)
    : { url: action, body: formData }
  await withDisabledForm(e.target, () => fetchAndSwapContent(url, method, target, body))
}

const buildGetRequest = (action, formData) => {
  const url = new URL(action, window.location.origin)
  const params = new URLSearchParams(formData)
  if (params.size) url.search = '?' + params.toString()
  return { url: url.href }
}

const withDisabledForm = async (form, func) => {
  updateInteractiveElements(form, disableElement)
  if (form.id) document.querySelectorAll(`[form="${form.id}"]`).forEach(disableElement)

  try {
    await func()
  } finally {
    updateInteractiveElements(form, enableElement)
    if (form.id) document.querySelectorAll(`[form="${form.id}"]`).forEach(enableElement)
  }
}

const updateInteractiveElements = (container, func) => {
  container.querySelectorAll('input, button, select, textarea')
    .forEach(func)
}

const disableElement = (el) => {
  if (!el.disabled) {
    el.disabled = true
    el.setAttribute('data-bixi-disabled', 'true')
    el.setAttribute('aria-disabled', 'true')
  }
}

const enableElement = (el) => {
  if (el.dataset.bixiDisabled) {
    el.disabled = false
    el.removeAttribute('data-bixi-disabled')
    el.removeAttribute('aria-disabled')
  }
}

const withRequestCoordination = async (target, doRequest) => {
  const toAbort = []
  for (const [otherTarget] of inFlightRequests.entries()) {
    if (target.el === otherTarget || target.el.contains(otherTarget)) {
      toAbort.push(otherTarget)
    } else if (otherTarget.contains(target.el)) {
      return // Parent request is in flight, skip this one
    }
  }
  toAbort.forEach(t => {
    const controller = inFlightRequests.get(t)
    controller?.abort()
  })
  await withInFlightRequest(target, doRequest)
}

const withInFlightRequest = async (target, doRequest) => {
  const controller = new AbortController()
  inFlightRequests.set(target.el, controller)

  try {
    await doRequest(controller.signal)
  } catch (error) {
    if (error.name !== 'AbortError') {
      throw error
    }
  } finally {
    inFlightRequests.delete(target.el)
  }
}

const tryHandleClick = (e) => withTryAsync(() => handleClick(e))

const handleClick = async (e) => {
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
  await fetchAndSwapContent(link.href, 'GET', target)
}

const getTarget = (targetName) => {
  const candidates = document.querySelectorAll(`[bx-pane="${targetName}"],[bx-nav-pane="${targetName}"]`)
  if (candidates.length === 0) throw new Error(`Bixi error: No pane named ${targetName} found in current document`)
  if (candidates.length > 1) throw new Error(`Bixi error: Multiple panes named ${targetName} found in current document`)
  const el = candidates[0]
  const type = el.hasAttribute('bx-pane') ? 'bx-pane' : 'bx-nav-pane'
  return { el, name: targetName, type }
}

export const fetchAndSwapContent = async (url, method, target, body, enableUIFeedback = true) => {
  const doRequest = async (signal) => {
    const { content, finalUrl } = await getContent(url, method, target, signal, body)
    await loadContent(target, content)
    if(target.type === 'bx-nav-pane') updateHistory(finalUrl, target.name)

  }
  enableUIFeedback
    ? await withUiFeedback(target.el, () => withRequestCoordination(target, doRequest))
    : await withRequestCoordination(target, doRequest)
}

const withUiFeedback = async (el, doRequest) => {
  updateInteractiveElements(el, disableElement)
  el.classList.add(busyClass)
  el.setAttribute('aria-busy', 'true')
  try {
    await doRequest()
  } finally {
    el.removeAttribute('aria-busy')
    el.classList.remove(busyClass)
    updateInteractiveElements(el, enableElement)
  }
}

const getContent = async (url, method, target, signal, body) => {
  const response = await fetch(url, { method, body, signal })
  const responseHTML = await response.text()
  const parsedDocument = parser.parseFromString(responseHTML, 'text/html')
  const candidates = parsedDocument.querySelectorAll(`[${target.type}="${target.name}"]`)
  if (candidates.length === 0) throw new Error(`Bixi error: No ${target.type} named ${target.name} found in server response`)
  if (candidates.length > 1) throw new Error(`Bixi error: Multiple ${target.type}s named ${target.name} found in server response`)
  return { content: candidates[0], finalUrl: response.url }
}

const loadContent = async (target, newContent) => {
  let loadedContent
  if (document.startViewTransition) {
    await document.startViewTransition(() => loadedContent = swapContent(target, newContent)).finished
  } else {
    loadedContent = swapContent(target, newContent)
  }
  const autoFocusEl = loadedContent.querySelector('[autofocus]')
  if (autoFocusEl) {
    autoFocusEl.focus()
    autoFocusEl.removeAttribute('autofocus')
  }
}

const updateHistory = (url, paneName) => {
  if (!historyStateReplaced) {
    history.replaceState({ paneName, url: window.location.href }, '', window.location.href)
    historyStateReplaced = true
  }
  history.pushState({ paneName, url }, '', url)
}

const swapContent = (target, newContent) => {
  const importedNode = document.importNode(newContent, true)
  target.el.replaceWith(importedNode)
  return importedNode
}

const tryHandlePopState = (e) => withTryAsync(() => handlePopState(e))

const handlePopState = async (event) => {
  if (!event.state) return

  // Cancel all in-flight requests, regardless of target
  inFlightRequests.forEach(controller => controller.abort())
  inFlightRequests.clear()

  const { paneName, url } = event.state
  const target = getTarget(paneName)
  if (target) {
    await withInFlightRequest(target, async (signal) => {
      const { content } = await getContent(url, 'GET', target, signal)
      await loadContent(target, content)
    })
  }
}

export function init(config) {
  onError = config?.onError ?? onError
  busyClass = config?.busyClass ?? busyClass
  document.addEventListener('click', tryHandleClick)
  document.addEventListener('submit', tryInterceptSubmit)
  window.addEventListener('popstate', tryHandlePopState)
}

export function destroy() {
  document.removeEventListener('click', tryHandleClick)
  document.removeEventListener('submit', tryInterceptSubmit)
  window.removeEventListener('popstate', tryHandlePopState)
}
