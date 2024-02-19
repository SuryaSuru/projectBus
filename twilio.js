// Import Twilio package
const twilio = require('twilio');

// Initialize Twilio client with your Twilio account SID and auth token
const client = twilio('<YourTwilioAccountSID>', '<YourTwilioAuthToken>');

// Function to send OTP via SMS using Twilio
async function sendOTP(contactInfo, otp) {
  try {
    // Send SMS message using Twilio API
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      to: contactInfo, // Receiver's phone number
      from: '<YourTwilioPhoneNumber>' // Your Twilio phone number
    });
    console.log('OTP sent successfully');
  } catch (error) {
    throw new Error('Failed to send OTP via Twilio');
  }
}
