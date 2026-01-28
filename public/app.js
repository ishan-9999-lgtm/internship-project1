const apiUrl = '/api/check';
const tempInput = document.getElementById('tempInput');
const checkBtn = document.getElementById('checkBtn');
const resultDiv = document.getElementById('result');
const fanSpan = document.getElementById('fanStatus');
const acSpan = document.getElementById('acStatus');
const heaterContainer = document.getElementById('heaterContainer');
const heaterSpan = document.getElementById('heaterStatus');
const powerSpan = document.getElementById('powerStatus');

checkBtn.addEventListener('click', async () => {
  const temperature = tempInput.value;
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature })
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    resultDiv.textContent = data.result;
    fanSpan.textContent = data.fan;
    acSpan.textContent = data.ac;
    heaterSpan.textContent = data.heater;
    heaterContainer.style.display = 'block';

  } catch (e) {
    alert('Failed to contact server.');
  }
});
