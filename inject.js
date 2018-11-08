function inject () {
  const modal = document.createElement('div')
  modal.id = 'weekly-food-modal'
  modal.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 800px;
    height: 300px;
    background: #333;
    color: white;
    padding: 10px;
    display: flex;
    font: 20px arial;
  `
  const currentDayIndex = new Date().getDay() - 1
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  const dropdowns = document.querySelectorAll('table select')
  const getLabel = index => dropdowns[index].selectedOptions[0].label
  const getDayStyle = (index, isDessert) => {
    if (isDessert) {
      return index === currentDayIndex
        ? 'background: #7b96e5; border-top: 1px solid white'
        : 'background: #555; border-top: 1px solid #888'
    }

    return index === currentDayIndex ? 'background: #5976c6' : 'background: #444'
  }

  const modalContent = weekDays
    .map(
      (day, i) => `
        <div style="flex: 1; margin: 2px; display: flex; flex-direction: column; cursor: default; ${getDayStyle(i)}">
          <div style="font-weight: bold; padding: 10px 5px;">${day}</div>
          <div style="padding: 10px 5px; min-height: 100px; flex: 1">${getLabel(i)}</div>
          <div style="padding: 10px 5px; flex: 1; ${getDayStyle(i, true)}">${getLabel(i + 5)}</div>
        </div>
          `
    )
    .join('')

  modal.innerHTML = modalContent
  document.body.appendChild(modal)
  const $modal = document.querySelector('#weekly-food-modal')

  // Add key binding.
  document.body.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return
    if ($modal.style.display === 'none') {
      $modal.style.display = 'flex'
    } else {
      $modal.style.display = 'none'
    }
  })

  // Hide ugly form.
  document.querySelector('form').style.display = 'none'

  // Update body background.
  document.querySelector('body').style.background = 'black'
}

module.exports = inject
