import multer from 'multer'

const storage = multer.memoryStorage(); // Store in memory as Buffer
export const upload = multer({ storage });
