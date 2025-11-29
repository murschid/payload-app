import { PayloadRequest } from 'payload'
import { authService } from '../services/auth'

export const authController = {
  verifyOTP: async (req: PayloadRequest) => {
    if (!req.json) {
      return Response.json({ error: 'Request body is missing' }, { status: 400 })
    }
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return Response.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    const users = await req.payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
      },
      overrideAccess: true,
      showHiddenFields: true,
    })

    if (users.totalDocs === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users.docs[0]
    const storedOTP = String(user.otp || '').trim()
    const receivedOTP = String(otp || '').trim()

    if (storedOTP !== receivedOTP) {
      return Response.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    if (user.otpExpiration && new Date(user.otpExpiration) < new Date()) {
      return Response.json({ error: 'OTP expired' }, { status: 400 })
    }

    await req.payload.update({
      collection: 'users',
      id: user.id,
      data: {
        isVerified: true,
        otp: null,
        otpExpiration: null,
      },
      overrideAccess: true,
    })

    return Response.json({ message: 'User verified successfully' })
  },

  resendOTP: async (req: PayloadRequest) => {
    if (!req.json) {
      return Response.json({ error: 'Request body is missing' }, { status: 400 })
    }
    const { email } = await req.json()

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 })
    }

    const users = await req.payload.find({
      collection: 'users',
      where: {
        email: { equals: email },
      },
      overrideAccess: true,
      showHiddenFields: true,
    })

    if (users.totalDocs === 0) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users.docs[0]

    if (user.isVerified) {
      return Response.json({ error: 'User is already verified' }, { status: 400 })
    }

    const { otp, otpExpiration } = authService.generateOTPData()

    await req.payload.update({
      collection: 'users',
      id: user.id,
      data: {
        otp,
        otpExpiration,
      },
      overrideAccess: true,
    })

    try {
      await authService.sendOTPEmail(email, otp)
    } catch (error) {
      return Response.json({ error: 'Error sending email' }, { status: 500 })
    }

    return Response.json({ message: 'OTP resent successfully' })
  },
}
