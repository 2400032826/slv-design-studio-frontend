const https = require('https');

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1p2C_7uNfCnHU-dFlwTlj14Avm0Xgz0c';

function extractDriveFileId(input) {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  const dMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (dMatch && dMatch[1]) return dMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  const ucMatch = trimmed.match(/\/uc\?[^#]*id=([a-zA-Z0-9_-]+)/);
  if (ucMatch && ucMatch[1]) return ucMatch[1];
  const lh3Match = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (lh3Match && lh3Match[1]) return lh3Match[1];
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) return trimmed;
  return null;
}

function buildDriveUrls(fileId) {
  return {
    thumbnailUrl: `https://lh3.googleusercontent.com/d/${fileId}=w400`,
    displayUrl: `https://lh3.googleusercontent.com/d/${fileId}=w1200`,
    directThumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
    webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
  };
}

async function fetchFromDriveApi(folderId, apiKey) {
  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false and mimeType contains 'image/'`);
  const fields = encodeURIComponent('files(id, name, mimeType, thumbnailLink, webViewLink, size, createdTime, modifiedTime)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100&key=${apiKey}`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300 && Array.isArray(parsed.files)) {
            resolve(parsed.files);
          } else {
            reject(new Error(parsed.error?.message || `Drive API error: ${res.statusCode}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || FOLDER_ID;
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY || process.env.GOOGLE_API_KEY;

  let files = [];
  if (apiKey) {
    try {
      const raw = await fetchFromDriveApi(folderId, apiKey);
      files = raw.map(f => ({
        fileId: f.id,
        name: f.name || 'Product Photo',
        mimeType: f.mimeType || 'image/jpeg',
        folderId,
        size: Number(f.size || 0),
        createdTime: f.createdTime || new Date().toISOString(),
        modifiedTime: f.modifiedTime || new Date().toISOString(),
        ...buildDriveUrls(f.id),
      }));
    } catch (err) {
      console.warn('Drive API fetch note:', err.message);
    }
  }

  return res.status(200).json({
    success: true,
    folderId,
    count: files.length,
    files,
    cachedAt: new Date().toISOString(),
  });
};
