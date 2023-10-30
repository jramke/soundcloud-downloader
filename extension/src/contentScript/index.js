(() => {
  console.log('soundcloud downloader added');
  const app = document.querySelector('#app')
  
  if (!app) return

  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        const tracklist = document.querySelector('.trackList') || document.querySelector('.systemPlaylistTrackList')
        const trackElements = tracklist?.querySelectorAll('ul li');
        if (!tracklist || trackElements.length === 0) return
        addButtons(trackElements)
      }
    }
  })
  observer.observe(app, { childList: true, subtree: true })

  function addButtons(trackElements) {
    trackElements.forEach((el) => {
      const btnGroup = el.querySelector('.trackItem__actions .sc-button-group')
      const track = el.querySelector('.trackItem__content .trackItem__trackTitle')?.href.split('?')[0]
      if (btnGroup?.querySelector('.sc-button-download')) return
      const button = createDownloadButton(track);
      btnGroup?.appendChild(button)
    })
  }

  function createDownloadButton(track) {
    const action = import.meta.env.VITE_SERVER_URL
    const form = document.createElement('form')
    form.action = action
    form.style.display = 'flex'
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
