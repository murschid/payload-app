import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { authController } from '../controllers/auth'
import { authService } from '../services/auth'

import {
  canAccessAdminUI,
  canDeleteUser,
  canManageUser,
  canMutateRole,
  isAdminFieldLevel,
  isAdminOrSelf,
  isAdminOrSuperAdmin,
} from '../access'




export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'User Management',
  },
  auth: true,
  access: {
    read: isAdminOrSelf,
    create: () => true,
    update: canManageUser,
    delete: canDeleteUser,
    admin: canAccessAdminUI,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const { otp, otpExpiration } = authService.generateOTPData()
          data.otp = otp
          data.otpExpiration = otpExpiration
          
          // Auto-verify Super Admins
          if (data.roles === 'superAdmin') {
            data.isVerified = true
          } else {
            data.isVerified = false
          }

          req.context.otp = data.otp
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          try {
            const otp = req.context.otp || doc.otp
            await authService.sendOTPEmail(doc.email, otp)
          } catch (error) {
            console.error('Error sending OTP email:', error)
          }
        }
      },
    ],
    beforeLogin: [
      async ({ user }) => {
        if (!user.isVerified) {
          throw new APIError('User is not verified', 401)
        }
        return user
      },
    ],
  },
  endpoints: [
    {
      path: '/verify-otp',
      method: 'post',
      handler: authController.verifyOTP,
    },
    {
      path: '/resend-otp',
      method: 'post',
      handler: authController.resendOTP,
    },
  ],
  fields: [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      label: 'Phone Number',
      required: false,
    },
    {
      name: 'address',
      type: 'text',
      label: 'Address',
      required: false,
    },
    {
      name: 'otp',
      type: 'text',
      access: {
        read: () => false,
        update: ({ req: { user } }) => user?.collection === 'users' && user.id === '3000a0f3-06ff-422c-bc1b-f048407320ac',
      },
      hidden: true,
    },
    {
      name: 'otpExpiration',
      type: 'date',
      hidden: true,
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      defaultValue: false,
      access: {
        update: isAdminFieldLevel,
      },
    },
    {
      name: 'roles',
      type: 'select',
      options: [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Premium User', value: 'premiumUser' },
      ],
      defaultValue: 'user',
      required: true,
      saveToJWT: true,
      access: {
        read: () => true,
        create: canMutateRole,
        update: canMutateRole,
      },
    },
  ],
}
