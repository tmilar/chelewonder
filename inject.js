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
    padding: 0px;
    display: flex;
    align-items: center;
    flex-flow: row wrap;
    justify-content: center;
    height: 100%;
    overflow: auto;
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

  const $descriptionsTable = document.querySelector('table#grdProductos')
  const currentDayIndex = new Date().getDay() - 1
  const weekDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
  const dropdowns = document.querySelectorAll('table select')
  const getLabel = (dayIndex, menuStyleIndex) => {
    if (menuStyleIndex === undefined) {
      return dropdowns[dayIndex].selectedOptions[0].label
    }
    return dropdowns[dayIndex].options[menuStyleIndex].label
  }

  const getDescription = (dayIndex, menuStyleIndex) => {
    const food = getLabel(dayIndex, menuStyleIndex)
    const foodMatcher = food.match(/-\s(.+)/)
    const foodName = foodMatcher && foodMatcher.length && foodMatcher[1]
    const LABEL_COL = 1
    const DESCRIPTION_COL = 5
    const descriptionRows = [...$descriptionsTable.getElementsByClassName('tr')].filter(($tableRow, i) => {
      const foodRowText = $tableRow.getElementsByTagName('td')[LABEL_COL].innerText
      return foodRowText === foodName
    })
    let descriptionText = 'Descripción no disponible'
    if (descriptionRows && descriptionRows.length) {
      descriptionText = descriptionRows[0].getElementsByTagName('td')[DESCRIPTION_COL].innerText
    }
    return descriptionText
  }

  const getDayStyle = (index, isDessert) => {
    if (isDessert) {
      return index === currentDayIndex
        ? 'background: #7b96e5; border-top: 1px solid white'
        : 'background: #555; border-top: 1px solid #888'
    }

    return index === currentDayIndex ? 'background: #5976c6' : 'background: #444'
  }

  const modalContentDays = weekDays
    .map(
      (day, i) => `
        <div style="display: flex; flex-direction: column; width: 260px; min-height: 300px; margin: 2px; cursor: default; ${getDayStyle(
        i
      )}">
          <div style="font-weight: bold; padding: 10px; font-size: 20px;">${day}</div>
          <div style="flex: 1; min-height: 100px; padding: 10px;">${getLabel(i)}</div>
          <div style="flex: 1; min-height: 80px; max-height: 80px; padding: 10px; color: lightgray; font-style: italic; font-size: 16px;">
            ${getDescription(i)}
          </div>
          <div style="flex: 1; min-height: 200px; padding: 10px; ${getDayStyle(i, true)}">${getLabel(i + 5)}</div>
        </div>
          `
    )

  const modalContent = modalContentDays.join('')
  modal.innerHTML = modalContent

  const menuStyles = [...document.getElementById('cmbSubGrp').options].map(option => option.value)

  // rows
  const nextWeekRows = [...menuStyles]
  // cols
  const nextWeekCols = [null, ...weekDays]

  const emptyCell = `<div style="flex: 1; padding: 10px; font-size: 20px;"></div>`

  const nextWeekColsContent = nextWeekCols.map((day, i) => {
    const dayIndex = i - 1
    const headerCell = day ? `<div style="flex: 1; font-weight: bold; padding: 10px; font-size: 20px;">${day}</div>` : emptyCell

    const rows = nextWeekRows.map((menuStyle, j) => {
      if (!day) {
        // menuStyle cell
        return `<div style="flex: 2; font-weight: bold; padding: 10px; font-size: 20px;">${menuStyle}</div>`
      }

      const nextWeekDropdowns = [...dropdowns]
        .map((dropdown, i) => ({dropdown, i}))
        .filter(({dropdown: {id}}) => /_nextWeek/.test(id))

      const dropdownDayIndex = nextWeekDropdowns[dayIndex].i

      // foodOption cell
      return `<div style="flex: 2; padding: 10px; max-height:100% ; ">
         <div style="flex: 1; max-height:50%; padding: 10px;">${getLabel(dropdownDayIndex, j)}</div>
         <div style="flex: 1; max-height:50%; padding: 10px; color: lightgray; font-style: italic; font-size: 16px;">
            ${getDescription(dropdownDayIndex, j)}
         </div>
      </div>`
    })

    const colContainer =
      `<div style="display: flex; flex-direction: column; width: 260px; min-height: 300px; margin: 2px; cursor: default; ${getDayStyle(i)}">
        ${headerCell}
        ${rows.join('\n')}
       </div>`

    return colContainer
  })

  const nextWeekGrid = document.createElement('div')
  nextWeekGrid.id = 'next-week-grid'
  nextWeekGrid.style.cssText =
    'display: none; ' + // intially hide it
    'flex-direction: row; ' +
    'position: absolute; ' +
    'top: 0px; ' +
    'right: 0px;'

  nextWeekGrid.innerHTML = nextWeekColsContent.join('\n')

  document.body.appendChild(backdrop)
  document.body.appendChild(modal)
  document.body.appendChild(nextWeekGrid)
  const $modal = document.querySelector('#weekly-food-modal')
  const $backdrop = document.querySelector('#weekly-food-backdrop')
  const $nextWeekForm = document.querySelector('#form1_nextWeek')
  const $nextWeekGrid = document.querySelector('#next-week-grid')
  const $body = document.querySelector('body')
  const $form = document.querySelector('form')

  let isNextWeek = false

  // Add key binding.
  document.body.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if ($modal.style.display === 'none') {
        $modal.style.display = 'flex'
        $backdrop.style.display = 'block'
        $body.style.background = 'black'
        $form.style.display = 'none'
        $descriptionsTable.style.display = 'none'
        $nextWeekForm.style.display = 'none'
      } else {
        $modal.style.display = 'none'
        $backdrop.style.display = 'none'
        $body.style.background = 'white'
        $form.style.display = 'block'
        $descriptionsTable.style.display = 'block'
        $nextWeekForm.style.display = 'block'
      }
    }

    if (!isNextWeek && (e.key === 'ArrowRight' || e.key === 'Right')) {
      // show next week grid, hide current week.
      isNextWeek = true
      $modal.style.display = 'none'
    }

    if (isNextWeek && (e.key === 'ArrowLeft' || e.key === 'Left')) {
      // show current week, hide next week.
      isNextWeek = false
      $modal.style.display = 'flex'
    }
  })

  // Hide ugly form.
  $form.style.display = 'none'
  $descriptionsTable.style.display = 'none'
  $nextWeekForm.style.display = 'none'

  // Update body background.
  document.querySelector('body').style.background = 'black'
}

module.exports = inject
