const axios = require('axios');
const sharp = require('sharp');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Only POST requests are allowed' });
    }

    const { url, width, height } = req.body;

    if (!url || !width || !height) {
        return res.status(400).json({ error: 'Missing required fields: url, width, height' });
    }

    try {
        // Télécharger l'image
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer',
        });

        // Redimensionner l'image et récupérer les pixels
        const buffer = await sharp(response.data)
            .resize(Number(width), Number(height))
            .raw()
            .toBuffer();

        const colors = [];
        for (let i = 0; i < buffer.length; i += 3) {
            colors.push({
                r: buffer[i],
                g: buffer[i + 1],
                b: buffer[i + 2],
            });
        }

        return res.status(200).json({ colors });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to process the image' });
    }
};
