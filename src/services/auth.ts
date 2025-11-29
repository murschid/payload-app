import { generateOTP } from '../utilities/generateOTP'
import { sendEmail } from '../utilities/sendEmail'

export const authService = {
  generateOTPData: () => {
    return {
      otp: generateOTP(),
      otpExpiration: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 mins
    }
  },

  sendOTPEmail: async (email: string, otp: string) => {
    try {
      await sendEmail(email, 'Your OTP Code', `<p>Your OTP code is: <strong>${otp}</strong></p><p>This code will expire in 10 minutes.</p>`)
      console.log(`OTP is ${otp} and sent to ${email}`)
    } catch (error) {
      console.error('Error sending OTP email:', error)
      throw error
    }
  },
}
