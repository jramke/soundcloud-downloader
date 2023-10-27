(() => {
  const tracklist = document.querySelector('.trackList')
  const trackElements = tracklist?.querySelectorAll('.trackList__item')

  if (!tracklist || trackElements.length === 0) return

  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        addButtons(tracklist?.querySelectorAll('.trackList__item'))
      }
    }
  })
  observer.observe(tracklist, { childList: true, subtree: true })

  function addButtons(trackElements) {
    trackElements.forEach((el) => {
      const btnGroup = el.querySelector('.trackList__item .sc-button-group')
      const track = el.querySelector('.trackList__item .trackItem__trackTitle')?.href.split('?')[0]
      if (btnGroup?.querySelector('.sc-button-download')) return
      btnGroup?.appendChild(createDownloadButton(track))
    })
  }

  function createDownloadButton(track) {
    const action = 'http://localhost:8080/download'
    const form = document.createElement('form')
    form.action = action
    form.insertAdjacentHTML(
      'beforeend',
      `
            <input type="hidden" name="track" value="${track}">
            <button type="submit" class="sc-button-download sc-button-secondary sc-button sc-button-small sc-button-responsive" title="Download">Download</button>
        `,
    )
    return form
  }
})()
