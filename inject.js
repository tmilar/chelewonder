function inject () {
  const modal = document.createElement('div')
  const backdrop = document.createElement('div')
  modal.id = 'weekly-food-modal'
  modal.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    color: white;
    padding: 10px;
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    justify-content: center;
    height: 100%;
    overflow: scroll;
    font-size: 18px;
    font-family: 'Roboto Slab', serif;
  `
  backdrop.id = 'weekly-food-backdrop'
  backdrop.style.cssText = `
    position: absolute;
    background: url('./background.jpg') no-repeat;
    background-size: cover;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    filter: blur(4px);
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
        <div style="display: flex; flex-direction: column; width: 260px; min-height: 300px; margin: 2px; cursor: default; ${getDayStyle(
          i
        )}">
          <div style="font-weight: bold; padding: 10px; font-size: 20px;">${day}</div>
          <div style="flex: 1; min-height: 200px; padding: 10px;">${getLabel(i)}</div>
          <div style="flex: 1; min-height: 200px; padding: 10px; ${getDayStyle(i, true)}">${getLabel(i + 5)}</div>
        </div>
          `
    )
    .join('')

  modal.innerHTML = modalContent
  document.body.appendChild(backdrop)
  document.body.appendChild(modal)
  const $modal = document.querySelector('#weekly-food-modal')
  const $backdrop = document.querySelector('#weekly-food-backdrop')
  const $body = document.querySelector('body')
  const $form = document.querySelector('form')

  // Add key binding.
  document.body.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return
    if ($modal.style.display === 'none') {
      $modal.style.display = 'flex'
      $backdrop.style.display = 'block'
      $body.style.background = 'black'
      $form.style.display = 'none'
    } else {
      $modal.style.display = 'none'
      $backdrop.style.display = 'none'
      $body.style.background = 'white'
      $form.style.display = 'block'
    }
  })

  // Hide ugly form.
  document.querySelector('form').style.display = 'none'

  // Update body background.
  document.querySelector('body').style.background = 'black'
}

module.exports = inject
