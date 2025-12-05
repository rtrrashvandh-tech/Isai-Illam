const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');

const filePath = path.resolve(process.cwd(), config.EXCEL_FILE_PATH);

const generateExcel = async (participant) => {
  let workbook;
  let worksheet;
  let headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Event', 'Registration Date'];
  
  try {
    // Try to read existing workbook
    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
      // Create new workbook if it doesn't exist
      workbook = XLSX.utils.book_new();
      worksheet = XLSX.utils.aoa_to_sheet([headers]);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
    }

    // Add new row
    const newRow = [
      participant.id,
      participant.name,
      participant.email,
      participant.phone,
      participant.department,
      participant.event,
      participant.registrationDate
    ];
    
    XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });
    XLSX.writeFile(workbook, filePath);
    
  } catch (error) {
    console.error('Error writing to Excel file:', error);
    throw error;
  }
};

module.exports = { generateExcel };