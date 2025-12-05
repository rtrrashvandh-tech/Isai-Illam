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
    
    // Determine the correct uploads directory
    // Try multiple paths to find the project root
    let uploadsDir;
    const possibleRoots = [
      path.resolve(__dirname, '../../'), // From backend/controllers -> project root
      path.resolve(process.cwd()), // Current working directory
      path.resolve(process.cwd(), '..'), // One level up
    ];
    
    // Find the first directory that exists and has a package.json
    let projectRoot = null;
    for (const root of possibleRoots) {
      const packageJsonPath = path.join(root, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        projectRoot = root;
        break;
      }
    }
    
    // Fallback to current working directory
    if (!projectRoot) {
      projectRoot = process.cwd();
    }
    
    uploadsDir = path.resolve(projectRoot, 'uploads');
    
    console.log('📁 __dirname:', __dirname);
    console.log('📁 process.cwd():', process.cwd());
    console.log('📁 Project root:', projectRoot);
    console.log('📁 Upload directory:', uploadsDir);
    
    // Ensure uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created directory:', uploadsDir);
    } else {
      console.log('✅ Directory already exists:', uploadsDir);
    }
    
    // Save file
    const filename = `payment-${participantId}-${Date.now()}.${extension}`;
    const filepath = path.join(uploadsDir, filename);
    
    console.log('💾 Saving file to:', filepath);
    console.log('💾 Buffer size:', buffer.length, 'bytes');
    
    fs.writeFileSync(filepath, buffer);
    
    // Verify file was written
    if (fs.existsSync(filepath)) {
      const stats = fs.statSync(filepath);
      console.log('✅ File saved successfully! Size:', stats.size, 'bytes');
    } else {
      console.error('❌ ERROR: File was not created!');
      throw new Error('File write operation failed');
    }
    
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
      console.log('💾 Attempting to save payment screenshot...');
      savedFilePath = saveBase64Image(paymentScreenshot, participantId);
      console.log('✅ Screenshot saved successfully to:', savedFilePath);
      
      // Verify file was actually created
      if (fs.existsSync(savedFilePath)) {
        const stats = fs.statSync(savedFilePath);
        console.log('✅ File verified - Size:', stats.size, 'bytes');
      } else {
        console.error('❌ ERROR: File was not created at:', savedFilePath);
      }
    } catch (error) {
      console.error('❌ Error saving screenshot:', error);
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