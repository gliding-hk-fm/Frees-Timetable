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
const periodSelect = document.querySelector('#periodSelect');
const themeSelect = document.querySelector('#themeSelect');
const timetable = document.querySelector('#timetable');
const cards = document.querySelector('#availabilityCards');
const title = document.querySelector('#selectionTitle');

periods.forEach(period => periodSelect.add(new Option(period, period)));

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
  });
  timetable.appendChild(body);
}

function renderAvailability() {
  const week = weekSelect.value;
  const period = periodSelect.value;
  const selected = timetableData[week][period];
  title.textContent = `Week ${week} · ${period}`;
  cards.innerHTML = days.map((day, index) => {
    const entries = selected[index];
    const isGeneralStudies = entries.includes('GS');
    const free = isGeneralStudies ? [] : entries.filter(code => people[code]);
    const freeNames = free.length
      ? free.map(code => `<span class="person-${code}">${people[code]}</span>`).join(', ')
      : (isGeneralStudies ? 'General Studies' : 'Nobody listed as free');
    return `<article class="day-card"><div class="day-name">${day}</div><div class="free-names ${free.length ? '' : 'none'}">${freeNames}</div></article>`;
  }).join('');
}

function render() {
  renderTable();
  renderAvailability();
}

weekSelect.addEventListener('change', render);
periodSelect.addEventListener('change', renderAvailability);
themeSelect.addEventListener('change', () => {
  document.body.classList.toggle('dark', themeSelect.value === 'dark');
});
render();
