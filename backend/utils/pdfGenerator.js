const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');

const generatePDF = async (participant) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 600]);
  const { width, height } = page.getSize();
  
  // Add background
  page.drawRectangle({
    x: 0,
    y: 0,
    width,
    height,
    color: rgb(0.95, 0.95, 1),
  });

  // Add header
  const headerText = 'Isai Illam - E-Pass';
  const headerFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const headerFontSize = 24;
  const headerWidth = headerFont.widthOfTextAtSize(headerText, headerFontSize);
  
  page.drawText(headerText, {
    x: (width - headerWidth) / 2,
    y: height - 50,
    size: headerFontSize,
    font: headerFont,
    color: rgb(0.2, 0.2, 0.4),
  });

  // Add QR Code
  const qrData = JSON.stringify({
    id: participant.id,
    name: participant.name,
    event: participant.event
  });
  
  const qrPng = qr.imageSync(qrData, { type: 'png' });
  const qrImage = await pdfDoc.embedPng(qrPng);
  const qrSize = 150;
  
  page.drawImage(qrImage, {
    x: (width - qrSize) / 2,
    y: height - 250,
    width: qrSize,
    height: qrSize,
  });

  // Add participant details
  const detailFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const detailFontSize = 12;
  let yPosition = height - 300;
  
 // In pdfGenerator.js, update the details array to use the correct field names:
const details = [
  `Name: ${participant.name}`,
  `Club: ${participant.department}`,
  `Event: ${participant.event}`,
  `Date: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`,
  `Contact: ${participant.phone}`,
  `Email: ${participant.email}`
];
  
  details.forEach((line, index) => {
    page.drawText(line, {
      x: 50,
      y: yPosition - (index * 25),
      size: detailFontSize,
      font: detailFont,
      color: rgb(0, 0, 0.2),
    });
  });

  // Add footer
  const footerText = 'Please present this pass at the venue for entry.';
  const footerFontSize = 10;
  const footerWidth = headerFont.widthOfTextAtSize(footerText, footerFontSize);
  
  page.drawText(footerText, {
    x: (width - footerWidth) / 2,
    y: 30,
    size: footerFontSize,
    font: detailFont,
    color: rgb(0.3, 0.3, 0.3),
  });

  return await pdfDoc.save();
};

module.exports = { generatePDF };