// src/config/pdfConfig.js
export const pdfConfig = {
  allowedExtensions: ['pdf'],
  maxFileSizeMB: 10,
  uploadPath: 'public/pdfs', // Netlify'da public/static klasörü
  publicPath: '/pdfs/' // Tarayıcıda erişilecek yol
};

// Netlify CMS media library için
export const mediaLibraryConfig = {
  name: 'pdf-uploads',
  config: {
    public_folder: '/pdfs',
    media_folder: 'public/pdfs'
  }
};