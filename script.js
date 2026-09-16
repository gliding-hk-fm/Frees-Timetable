const people = { L: 'Leila', O: 'Olivia', A: 'Adam', F: 'Felix', J: 'Joshua' };
const days = ['Mon', 'Tue', 'Wed', 'Thurs', 'Fri'];
const periods = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7'];

// Entries transcribed from the supplied timetable image. An empty string means no one is scheduled.
const timetableData = {
  A: {
    P1: [['L'], ['J'], [], [], ['J', 'F', 'L', 'A']],
    P2: [['J'], ['J'], ['J', 'F', 'L', 'A'], ['L', 'A'], ['L', 'A']],
    P3: [['O', 'F'], ['L', 'A'], ['F', 'A'], ['L', 'A'], ['L', 'A']],
    P4: [[], ['GAMES'], ['O', 'L', 'A'], ['J'], ['J']],
    P5: [[], ['GAMES'], ['J'], [], ['J', 'O', 'F', 'A']],
    P6: [['J', 'F', 'L', 'A'], ['F'], ['F'], ['GAMES'], []],
    P7: [['L', 'A'], ['J', 'F'], ['F'], ['GAMES'], []]
  },
  B: {
    P1: [['L'], ['O'], ['F'], [], ['L', 'A']],
    P2: [['J', 'O', 'F', 'A'], ['F', 'A'], ['J', 'F', 'L'], ['F'], ['L', 'A']],
    P3: [['J', 'L'], ['GS'], ['J', 'F'], ['F'], ['J']],
    P4: [[], ['GAMES'], ['O', 'L', 'A'], ['J'], []],
    P5: [[], ['GAMES'], ['J'], ['J'], ['J', 'L']],
    P6: [['J', 'F'], ['L', 'A'], [], ['GAMES'], ['J', 'F', 'A']],
    P7: [['F'], ['L', 'A'], [], ['GAMES'], ['J', 'F']]
  }
};

const weekSelect = document.querySelector('#weekSelect');
const daySelect = document.querySelector('#daySelect');
const themeSelect = document.querySelector('#themeSelect');
const timetable = document.querySelector('#timetable');
const cards = document.querySelector('#availabilityCards');
const title = document.querySelector('#selectionTitle');

days.forEach(day => daySelect.add(new Option(day, day)));

function entryMarkup(entries) {
  if (!entries.length) return '';
  if (entries.includes('GAMES')) return '<span class="games">GAMES</span>';
  if (entries.includes('GS')) return '<span class="general-studies">GENERAL STUDIES</span>';
  return `<span class="entry">${entries.map(code => `<span class="initial person-${code}">${people[code]}</span>`).join(', ')}</span>`;
}

function renderTable() {
  const week = weekSelect.value;
  timetable.innerHTML = `<thead><tr><th>Week ${week}</th>${days.map(day => `<th>${day}</th>`).join('')}</tr></thead>`;
  const body = document.createElement('tbody');
  periods.forEach(period => {
    const row = document.createElement('tr');
    const cells = timetableData[week][period].map(entries => `<td>${entryMarkup(entries)}</td>`).join('');
    row.innerHTML = `<td class="period">${period}</td>${cells}`;
    body.appendChild(row);

    if (period === 'P3' || period === 'P5') {
      const breakRow = document.createElement('tr');
      const label = period === 'P3' ? 'Breaktime' : 'Lunchtime';
      breakRow.className = 'schedule-break';
      breakRow.innerHTML = `<td colspan="6">${label}</td>`;
      body.appendChild(breakRow);
    }
  });
  timetable.appendChild(body);
}

function renderAvailability() {
  const week = weekSelect.value;
  const day = daySelect.value;
  const dayIndex = days.indexOf(day);
  title.textContent = `Week ${week} · ${day}`;
  cards.innerHTML = periods.map(period => {
    const entries = timetableData[week][period][dayIndex];
    const isGeneralStudies = entries.includes('GS');
    const scheduled = isGeneralStudies || entries.includes('GAMES')
      ? []
      : entries.filter(code => people[code]);
    const status = isGeneralStudies
      ? 'General Studies'
      : entries.includes('GAMES')
        ? 'GAMES'
        : scheduled.length
          ? scheduled.map(code => `<span class="person-${code}">${people[code]}</span>`).join(', ')
          : 'Nobody listed as scheduled';
    return `<article class="day-card"><div class="day-name">${period}</div><div class="free-names ${scheduled.length ? '' : 'none'}">${status}</div></article>`;
  }).join('');
}

function render() {
  renderTable();
  renderAvailability();
}

weekSelect.addEventListener('change', render);
daySelect.addEventListener('change', renderAvailability);
themeSelect.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSelect.value === 'dark');
});
render();
