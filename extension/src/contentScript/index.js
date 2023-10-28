(() => {
  const app = document.querySelector('#app')
  
  if (!app) return

  const observer = new MutationObserver((mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        const tracklist = document.querySelector('.trackList')
        const trackElements = tracklist?.querySelectorAll('.trackList__item')
        if (!tracklist || trackElements.length === 0) return
        addButtons(tracklist?.querySelectorAll('.trackList__item'))
      }
    }
  })
  observer.observe(app, { childList: true, subtree: true })

  function addButtons(trackElements) {
    trackElements.forEach((el) => {
      const btnGroup = el.querySelector('.trackList__item .sc-button-group')
      const track = el.querySelector('.trackList__item .trackItem__trackTitle')?.href.split('?')[0]
      if (btnGroup?.querySelector('.sc-button-download')) return
      const button = createDownloadButton(track);
      // button.onsubmit = (e) => {
      //   e.preventDefault()
      //   if (window.trackDownloading) {
      //     return
      //   }
      //   window.trackDownloading = true
      //   button.querySelector('button').disabled = true
      //   // not working if the two switches in chrome://settings/downloads are disabled
      //   window.addEventListener('blur', disableDownloadStateOnWindowBlur)
      //   button.submit()
      // }
      btnGroup?.appendChild(button)
    })
  }

  // function disableDownloadStateOnWindowBlur() {
  //   window.trackDownloading = false
  //   document.querySelectorAll('.sc-button-download').forEach(e => e.disabled = false)
  //   window.removeEventListener('blur', disableDownloadStateOnWindowBlur);
  // }

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
    // const button = document.createElement('button');
    // button.title = 'Download'
    // button.innerText = 'Download'
    // button.className = 'sc-button-download sc-button-secondary sc-button sc-button-small sc-button-responsive'
    // button.onclick = async () => {
    //   button.disabled = true
    //   const response = await axios({ url: action, method: 'GET', responseType: 'blob' })
    //   console.log(response);
    //   // create file link in browser's memory
    //   const href = URL.createObjectURL(response.data);
    //   // create "a" HTML element with href to file & click
    //   const link = document.createElement('a');
    //   link.href = href;
    //   link.setAttribute('download', 'file.pdf'); //or any other extension
    //   document.body.appendChild(link);
    //   link.click();

    //   // clean up "a" element & remove ObjectURL
    //   document.body.removeChild(link);
    //   URL.revokeObjectURL(href); 
    //   button.disabled = false
    // }
    // return button
  }
})()
