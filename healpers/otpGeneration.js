const OtpModel = require("../models/otpModel");
const sendEmail = require("../utiles/sendEmail");

function generateOtp(length) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

async function createOtp(email) {
  try {
    const otp = generateOtp(6); // Generate a 6-digit OTP

    const subject = "Verify Your Email";
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    /* Reset default styling */
    body {
  margin: 0;
  padding: 0;
}

/* Wrapper styles */
.email-wrapper {
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* Header styles */
.header {
  background-color: #3bb19b;
  color: #fff;
  text-align: center;
  padding: 10px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

/* Content styles */
.content {
  padding: 20px;
  background-color: #fff;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}

/* OTP section */
.otp {
  background-color: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  text-align: center;
}

/* Footer styles */
.footer {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

/* Styling to highlight company name */
.company-name {
  font-size: 18px;
  font-weight: bold;
  color: #3bb19b; /* Same as header background color */
  margin-bottom: 10px;
}

  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header">
      <h2>Email Verification</h2>
    </div>
    <div class="content">
      <p>Dear User,</p>
      <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
      <div class="otp">
        <strong>OTP:</strong> ${otp} 
      </div>
      <p>This OTP is valid for 2 minutes.</p>
      <p>If you did not request this verification, please ignore this email.</p>
      <p>Best regards,<br><span class="company-name">BVK Industries Pvt Ltd</span></p>
    </div>
    <div class="footer">
      <p>This email was sent by BVK Industries Pvt Ltd Pvt Ltd. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

    await sendEmail(email, subject, "BVK Industries Pvt Ltd", htmlContent);
    const otpDocument = new OtpModel({ email, otp });
    await otpDocument.save();
    return otp;
  } catch (error) {
    throw error;
  }
}

module.exports = createOtp;
