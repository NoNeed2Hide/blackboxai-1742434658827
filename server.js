const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();

// Admin token - in production this should be an environment variable
const ADMIN_TOKEN = 'your-secret-admin-token-123';

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes
app.get('/api/content', async (req, res) => {
    try {
        const data = await fs.readFile(path.join(__dirname, 'content.json'), 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading content:', error);
        res.status(500).json({ error: 'Failed to read content' });
    }
});

app.post('/api/content', async (req, res) => {
    const adminToken = req.headers['x-admin-token'];
    
    if (adminToken !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const content = req.body;
        await fs.writeFile(
            path.join(__dirname, 'content.json'),
            JSON.stringify(content, null, 2),
            'utf8'
        );
        res.json({ message: 'Content updated successfully' });
    } catch (error) {
        console.error('Error writing content:', error);
        res.status(500).json({ error: 'Failed to update content' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});