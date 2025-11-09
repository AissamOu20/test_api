import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // Allow your Firebase site to call this

// --- ⚠️ YOUR SECRET API KEY LIVES HERE ---
// We will get this from Render's "Environment Variables"
const API_KEY = process.env.PIXELDRAIN_API_KEY; 
const AUTH_HEADER = "Basic " + Buffer.from(`:${API_KEY}`).toString('base64');

// === ROUTE 1: GET THE FILE LIST ===
app.get('/api/files', async (req, res) => {
    const url = "https://pixeldrain.com/api/user/files";
    try {
        const apiResponse = await fetch(url, {
            headers: { 'Authorization': AUTH_HEADER }
        });
        const files = await apiResponse.json();
        res.status(apiResponse.status).json(files);
    } catch (e) { res.status(500).json({ message: e.message }) }
});

// === ROUTE 2: UPLOAD A FILE ===
app.put('/api/upload/:filename', async (req, res) => {
    const url = `https://pixeldrain.com/api/file/${encodeURIComponent(req.params.filename)}`;
    try {
        const apiResponse = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': AUTH_HEADER },
            body: req, // This streams the file from the browser
            duplex: "half"
        });
        const result = await apiResponse.json();
        res.status(apiResponse.status).json(result);
    } catch (e) { res.status(500).json({ message: e.message }) }
});

// === ROUTE 3: DELETE A FILE ===
app.delete('/api/file/:id', async (req, res) => {
    const url = `https://pixeldrain.com/api/file/${req.params.id}`;
    try {
        const apiResponse = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': AUTH_HEADER }
        });
        const result = await apiResponse.json();
        res.status(apiResponse.status).json(result);
    } catch (e) { res.status(500).json({ message: e.message }) }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));