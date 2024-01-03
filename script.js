const timeOptions = document.querySelector('.time-options-container');
const lastSpentArr = Array.from(document.querySelectorAll('.last-spent-type'));

function switchSelectedButton(target) {
  const currSelected = timeOptions.querySelector('.time-button-selected');
  currSelected.classList.remove('time-button-selected');
  target.classList.add('time-button-selected');
}

function modifyLastTimeText(target) {
  let newTime = '';
  const targetText = target.innerText;
  if (targetText === 'Weekly' || targetText === 'Monthly') {
    newTime = 'Last ' + targetText.slice(0, -2);
  }
  else {
    newTime = 'Yesterday';
  }
  lastSpentArr.forEach(text => {
    text.innerText = newTime;  
  })
}

function modifyHours(target) {
  fetch('./data.json')
    .then(response => {
      // Check for connected responsr
      if (!response.ok) {
        throw new Error('FAILED RESPONSE');
      }
      return response.json();
    })
    .then(data => {
      // Work with the JSON data
      data.forEach(dataPiece => {
        // Get category container and  hour elements
        const updatedTitle = dataPiece.title.toLowerCase().replace(' ', '-');
        const categoryContainerEle = document.getElementById('category-container-' + updatedTitle);
        const categoryCurrHrs = categoryContainerEle.querySelector('.hours-spent');
        const categoryPrevHrs = categoryContainerEle.querySelector('.hours-last-spent')

        // Set new hours
        const timeFrame = target.innerText.toLowerCase();
        const currHr = dataPiece.timeframes[timeFrame].current;
        const prevHr = dataPiece.timeframes[timeFrame].previous;
        const updatedCurrHr = currHr === 1 ? currHr + 'hr' : currHr + 'hrs';
        const updatedPrevHr = prevHr === 1 ? prevHr + 'hr' : prevHr + 'hrs';
        categoryCurrHrs.innerText = updatedCurrHr;
        categoryPrevHrs.innerText = updatedPrevHr;
      })
    })
    .catch(error => {
      // Handle errors that might occur during fetch
      console.error('THERE WAS A PROBLEM HANDLING YOUR DATA:', error);
    });
}


timeOptions.addEventListener('click', e => {
  const target = e.target.closest('button');
  if (target) {
    switchSelectedButton(target);
    modifyLastTimeText(target);
    modifyHours(target)   
  }
})
