const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

document.getElementById('agentButton').addEventListener('click', () => {
  showToast('Analyst agent is ready for your question.');
});

document.getElementById('promptChip').addEventListener('click', () => {
  showToast('Opening a service level investigation...');
});

document.getElementById('insightButton').addEventListener('click', () => {
  showToast('Full insight feed opened.');
});

document.getElementById('dateButton').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const isToday = button.dataset.today === 'true';
  button.dataset.today = String(!isToday);
  button.innerHTML = isToday ? 'Last 7 days <span>⌄</span>' : 'Today <span>⌄</span>';
  showToast(isToday ? 'Showing the last 7 days.' : 'Showing today’s activity.');
});

document.querySelectorAll('.insight-item').forEach((item) => {
  item.addEventListener('click', () => {
    const title = item.querySelector('strong').textContent;
    showToast(`Opening signal: ${title}`);
  });
});

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach((navItem) => navItem.classList.remove('active'));
    item.classList.add('active');
  });
});

document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    document.getElementById('agentButton').click();
  }
});
