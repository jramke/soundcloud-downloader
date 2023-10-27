
(() => {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    const tabId = tabs[0].id;
    chrome.scripting.executeScript(
      { 
        target: { tabId: tabId }, 
        function: () => {
          const tracklist = document.querySelector('.trackList');
          const trackElements = tracklist?.querySelectorAll('.trackList__item');
          console.log(tracklist, trackElements);
          if (!tracklist || trackElements.length === 0) return;
        
          trackElements.forEach(el => {
            const btnGroup = el.querySelector('.trackList__item .sc-button-group');
            const track = el.querySelector('.trackList__item .trackItem__trackTitle')?.href.split('?')[0];
            btnGroup.appendChild(createDownloadButton(track))
          })

          function createDownloadButton(track) {
            const action = 'http://localhost:8080/download';
            const form = document.createElement('form');
            form.action = action;
            form.insertAdjacentHTML('beforeend', `
              <input type="hidden" name="track" value="${track}">
              <button type="submit" class="sc-button-download sc-button-secondary sc-button sc-button-small sc-button-responsive" title="Download">Download</button>
            `);
            return form;
          }
        },
      },
      (results) => {
        if (chrome.runtime.lastError) {
          console.error(JSON.stringify(chrome.runtime.lastError));
          return;
        }

        const pageContent = results[0].result;
        console.log("Page content:", pageContent);
      }
    )
  })
})();




