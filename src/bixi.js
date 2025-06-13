const parser = new DOMParser()
  
const handleClick = async (e) => {
  if (e.button === 1 || e.ctrlKey || e.metaKey || e.shiftKey) return // Modifiers to open a link in a new tab
  const link = e.target.closest('a[bx-target]')
  if (!link || new URL(link.href).origin !== window.location.origin) return
  const target = getTarget(link.getAttribute('bx-target'), link)
  e.preventDefault()
  await fetchAndSwapContent(link.href, 'GET', target)
}

const getTarget = (targetName) => {
  const el = document.querySelector(`[bx-pane="${targetName}"]`)

  if (!el) {
    throw new Error(`Bixi error: No pane named ${targetName} found`)
  }

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
  return parsedDocument.querySelector(`[bx-pane="${target.name}"]`)
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
  document.addEventListener('click', handleClick)
}

export function destroy() {
  document.removeEventListener('click', handleClick)
}