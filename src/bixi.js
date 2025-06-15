const parser = new DOMParser()

let onError = (error) => { throw error }

const withTryAsync = async (func) => {
  try {
    await func()
  } catch (error) {
    onError(error)
  }
}

const tryHandleClick = (e) => withTryAsync(() => handleClick(e))

const handleClick = async (e) => {
  if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) return // Modifiers to open a link in a new tab
  const link = e.target.closest('a[bx-target]')
  if (!link) return
  e.preventDefault()
  if (new URL(link.href).origin !== window.location.origin) throw new Error('Bixi error: Cannot progressively enhance external links')
  if (link.hasAttribute('target')) throw new Error('Bixi error: Cannot progressively enhance links with target attribute')
  const target = getTarget(link.getAttribute('bx-target'), link)
  await fetchAndSwapContent(link.href, 'GET', target)
}

const getTarget = (targetName) => {
  const el = document.querySelector(`[bx-pane="${targetName}"]`)
  if (!el) throw new Error(`Bixi error: No pane named ${targetName} found in current document`)
  return { el, name: targetName }
}

export const fetchAndSwapContent = async (url, method, target) => {
  const content = await getContent(url, method, target)
  await loadContent(target, content)
}

const getContent = async (url, method, target) => {
  const response = await fetch(url, { method })
  const responseHTML = await response.text()
  const parsedDocument = parser.parseFromString(responseHTML, 'text/html')
  const pane = parsedDocument.querySelector(`[bx-pane="${target.name}"]`)
  if (!pane) throw new Error(`Bixi error: No pane named ${target.name} found in server response`)
  return pane
}

const loadContent = async (target, newContent) => {
  let loadedContent
  if (document.startViewTransition) {
    await document.startViewTransition(() => loadedContent = swapContent(target, newContent)).finished
  } else {
    loadedContent = swapContent(target, newContent)
  }
}

const swapContent = (target, newContent) => {
  const importedNode = document.importNode(newContent, true)
  target.el.replaceWith(importedNode)
  return importedNode
}

export function init(config) {
  onError = config?.onError ?? onError
  document.addEventListener('click', tryHandleClick)
}

export function destroy() {
  document.removeEventListener('click', tryHandleClick)
}