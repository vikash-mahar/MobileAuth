import twilio from "twilio";
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

const sendSMS = (to, otp) => {
  return client.messages.create({
    body: `Your OTP is ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: `+91${to}`
  });
};

export default sendSMS;
