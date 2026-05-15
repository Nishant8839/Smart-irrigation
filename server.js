const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
// Serve static files from current directory
app.use(express.static(path.join(__dirname)));

// In-memory data stores (Note: resets on server restart)
const users = [];
const history = [];

// Function to determine water advice based on multiple factors
function getWateringAdvice(crop, days, soil, moisture) {
    let advice = "";
    let severity = "normal"; // normal, warning, critical

    // Soil type modifiers
    let moistureThresholds = { low: 30, optimal: 60 };
    if (soil === 'sandy') {
        moistureThresholds = { low: 40, optimal: 70 }; // Drains fast
    } else if (soil === 'clay') {
        moistureThresholds = { low: 20, optimal: 50 }; // Retains water
    }

    if (moisture < moistureThresholds.low) {
        advice = `CRITICAL: For ${crop} (${days} days old) in ${soil} soil, moisture is severely low (${moisture}%). Water immediately to prevent wilting!`;
        severity = "critical";
    } else if (moisture >= moistureThresholds.low && moisture <= moistureThresholds.optimal) {
        advice = `GOOD: Moisture level is optimal (${moisture}%). Monitor regularly but no immediate action needed.`;
        severity = "normal";
    } else {
        advice = `WARNING: Soil is potentially overwatered (${moisture}%). Withhold watering and ensure proper drainage.`;
        severity = "warning";
    }
    return { advice, severity };
}

// Routes
app.post('/get-advice', (req, res) => {
    const { crop, days, soil, moisture } = req.body;
    
    // Server-side validation
    if (!crop || !soil) {
        return res.status(400).json({ error: 'Crop and Soil are required.' });
    }
    if (days === undefined || days < 0) {
        return res.status(400).json({ error: 'Days since planting must be a positive number.' });
    }
    if (moisture === undefined || moisture < 0 || moisture > 100) {
        return res.status(400).json({ error: 'Moisture must be a percentage between 0 and 100.' });
    }
    
    const result = getWateringAdvice(crop, days, soil, moisture);
    
    // Save to history
    const record = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        crop, days, soil, moisture,
        advice: result.advice,
        severity: result.severity
    };
    history.unshift(record); // Add to beginning
    if (history.length > 20) history.pop(); // Keep only last 20
    
    res.json(result);
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
         return res.status(400).json({ error: 'All fields are required.' });
    }
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'Email already registered.' });
    }
    users.push({ name, email, password });
    res.json({ message: 'Registration successful!' });
});

app.get('/api/dashboard', (req, res) => {
    // Simulated live sensor data
    res.json({
        moisture: Math.floor(Math.random() * 40) + 30, // 30-70%
        temperature: Math.floor(Math.random() * 15) + 15, // 15-30C
        humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
        lastWatered: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toLocaleString()
    });
});

app.get('/api/weather', (req, res) => {
    // Simulated weather forecast
    const conditions = ['Sunny', 'Partly Cloudy', 'Rain', 'Overcast'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    res.json({
        condition: randomCondition,
        temp: Math.floor(Math.random() * 15) + 15,
        precipitationChance: randomCondition === 'Rain' ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 30)
    });
});

app.get('/api/history', (req, res) => {
    res.json(history);
});

// Fallback route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
