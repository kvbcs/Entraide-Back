import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {  UseInterceptors } from '@nestjs/common';

// Fonction utilitaire qui retourne un interceptor prêt à l'emploi
export function ImageUploadInterceptor(fieldName = 'image') {
  return UseInterceptors(
    // FileInterceptor intercepte le champ "image" du form-data
    FileInterceptor(fieldName, {
      // Configuration de Multer (lib qui gère l'upload)
      storage: diskStorage({
        // Destination = dossier où les fichiers seront stockés
        destination: './uploads',

        // Fonction pour générer un nom de fichier unique
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + file.originalname;
          cb(null, unique); // cb(error, filename)
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // limite 5 MB
    }),
  );
}
