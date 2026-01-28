const express = require('express');

const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Temperature evaluation logic (including cold ranges and heater info)
function evaluateTemp(temp) {
    // Cold range handling (below 20°C) - 5 degree intervals
    if (temp < 5) {
        return { result: 'Temperature is Freezing', fan: 'OFF', ac: 'OFF', heater: 'ON (100% power)' };
    }
    if (temp < 10) {
        return { result: 'Temperature is Very Cold', fan: 'OFF', ac: 'OFF', heater: 'ON (80% power)' };
    }
    if (temp < 15) {
        return { result: 'Temperature is Cold', fan: 'OFF', ac: 'OFF', heater: 'ON (60% power)' };
    }
    if (temp < 20) {
        return { result: 'Temperature is Cool', fan: 'OFF', ac: 'OFF', heater: 'ON (30% power)' };
    }
    // Warm range (20°C and above) - 5 degree intervals with fan + AC combinations
    if (temp < 25) {
        return { result: 'Temperature is Normal', fan: 'OFF', ac: 'OFF', heater: 'OFF' };
    }
    if (temp < 30) {
        return { result: 'Temperature is Slightly High', fan: 'ON (30% power)', ac: 'ON (20% power)', heater: 'OFF' };
    }
    if (temp < 35) {
        return { result: 'Temperature is High', fan: 'ON (60% power)', ac: 'ON (50% power)', heater: 'OFF' };
    }
    if (temp < 40) {
        return { result: 'Temperature is Very High', fan: 'ON (100% power)', ac: 'ON (80% power)', heater: 'OFF' };
    }
    return { result: 'Temperature is Critical', fan: 'ON (100% power)', ac: 'ON (100% power)', heater: 'OFF' };
}

app.post('/api/check', (req, res) => {
    const { temperature } = req.body;
    const tempNum = parseFloat(temperature);
    if (isNaN(tempNum)) {
        return res.status(400).json({ error: 'Please provide a numeric temperature.' });
    }
    const status = evaluateTemp(tempNum);
    res.json(status);
});

// Fallback to index.html for SPA routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
