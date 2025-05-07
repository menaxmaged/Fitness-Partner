import * as fs from 'fs';
import * as path from 'path';

export const saveTrainerImage = (file: Express.Multer.File, trainerId: string): string => {
  if (!file) return '/assets/trainers-imgs/default.jpg';
  
  // Get file extension
  const fileExtension = path.extname(file.originalname);
  
  // Create filename based on trainer ID
  const filename = `t${trainerId}${fileExtension}`;
  
  // Define path where to save the file (adjust based on your project structure)
  // Make sure this directory exists
  const uploadDir = path.join(process.cwd(), 'public/assets/trainers-imgs');
  
  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const filePath = path.join(uploadDir, filename);
  
  // Write the file
  fs.writeFileSync(filePath, file.buffer);
  
  // Return the URL path to the image
  return `/assets/trainers-imgs/${filename}`;
};