const { generateExcel } = require('../utils/excelGenerator');
const { generatePDF } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailService');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Helper function to save base64 image to file
const saveBase64Image = (base64String, participantId) => {
  try {
    // Extract the base64 data (remove data:image/...;base64, prefix if present)
    const base64Data = base64String.replace(/^data:(image|application)\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Determine file extension from base64 string or default to png
    let extension = 'png';
    if (base64String.includes('data:image/jpeg') || base64String.includes('data:image/jpg')) {
      extension = 'jpg';
    } else if (base64String.includes('data:image/png')) {
      extension = 'png';
    } else if (base64String.includes('data:application/pdf')) {
      extension = 'pdf';
    }
    
    // Use OS temp directory for serverless environments (Netlify), otherwise use uploads directory
    const isServerless = process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME;
    const uploadsDir = isServerless 
      ? os.tmpdir() // Use OS temp directory (works on Windows, Linux, Mac)
      : path.resolve(process.cwd(), 'uploads');
    
    console.log('Upload directory:', uploadsDir);
    console.log('Is serverless:', isServerless);
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created directory:', uploadsDir);
    }
    
    // Save file
    const filename = `payment-${participantId}-${Date.now()}.${extension}`;
    const filepath = path.join(uploadsDir, filename);
    fs.writeFileSync(filepath, buffer);
    
    return filepath;
  } catch (error) {
    console.error('Error saving base64 image:', error);
    throw new Error('Failed to save payment screenshot');
  }
};

exports.registerParticipant = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, clubName, event, paymentScreenshot } = req.body;

    // Validate required fields
    if (!fullName || !email || !mobileNumber || !clubName) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields'
      });
    }

    // Validate payment screenshot
    if (!paymentScreenshot) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment screenshot is required'
      });
    }

    const participantId = uuidv4().substring(0, 6).toUpperCase();
    const registrationDate = new Date().toISOString();

    // Save base64 image to file
    let savedFilePath = null;
    try {
      savedFilePath = saveBase64Image(paymentScreenshot, participantId);
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message || 'Error processing payment screenshot'
      });
    }

    // Prepare participant data
    const participant = {
      id: participantId,
      name: fullName,
      email,
      phone: mobileNumber,
      department: clubName,
      event: event || 'Isai Illam',
      registrationDate,
      paymentScreenshot: savedFilePath ? path.basename(savedFilePath) : null
    };

    // Save to Excel
    await generateExcel(participant);

    // Generate PDF
    const pdfBuffer = await generatePDF(participant);

    // Send email with PDF attachment (non-blocking - registration succeeds even if email fails)
    let emailSent = false;
    try {
      await sendEmail({
        to: email,
        subject: 'Isai Ellam – E-Pass Confirmation',
        text: `Dear ${fullName},\n\nYour registration for ${event || 'Isai Illam'} is confirmed!\n\nYour Participant ID: ${participantId}\n\nPlease find your e-pass attached. Please show this pass at the venue for entry.\n\nWe look forward to seeing you at the event!\n\nBest regards,\nRotaract Club Of KPRCAS`,
        attachments: [{
          filename: `Isai-Ellam-Pass-${participantId}.pdf`,
          content: pdfBuffer
        }]
      });
      emailSent = true;
    } catch (emailError) {
      console.error('⚠️  Registration succeeded but email failed:', emailError.message);
      // Don't fail registration if email fails
    }

    res.status(200).json({
      status: 'success',
      message: emailSent 
        ? 'Registration successful! E-pass has been sent to your email.'
        : 'Registration successful! (Note: Email could not be sent. Please contact support if you need your e-pass.)',
      participantId,
      emailSent
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to process registration'
    });
  }
};