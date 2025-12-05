const { generateExcel } = require('../utils/excelGenerator');
const { generatePDF } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailService');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');

exports.registerParticipant = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, clubName, event } = req.body;
    const participantId = uuidv4().substring(0, 6).toUpperCase();
    const registrationDate = new Date().toISOString();

    // Prepare participant data with correct field mapping
    const participant = {
      id: participantId,
      name: fullName,  // Map fullName to name
      email,
      phone: mobileNumber,  // Map mobileNumber to phone
      department: clubName,  // Map clubName to department
      event: event || 'Isai Illam',  // Default event name if not provided
      registrationDate
    };

    // Save to Excel
    await generateExcel(participant);

    // Generate PDF
    const pdfBuffer = await generatePDF(participant);

    // Send email with PDF attachment
    await sendEmail({
      to: email,
      subject: 'Isai Ellam – E-Pass Confirmation',
      text: 'Your registration is confirmed. Please show the attached pass at entry.',
      attachments: [{
        filename: `Isai-Ellam-Pass-${participantId}.pdf`,
        content: pdfBuffer
      }]
    });

    res.status(200).json({
      status: 'success',
      message: 'E-pass sent to email'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process registration'
    });
  }
};