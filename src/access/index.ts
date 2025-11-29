import type { Access, FieldAccess, Where } from 'payload'
import type { User } from '../payload-types'

export const isSuperAdmin: Access<User> = ({ req: { user } }) => {
  return Boolean(user?.roles === 'superAdmin')
}

export const isAdmin: Access<User> = ({ req: { user } }) => {
  return Boolean(user?.roles === 'admin')
}

export const isAdminOrSuperAdmin: Access<User> = ({ req: { user } }) => {
  return Boolean(user?.roles === 'admin' || user?.roles === 'superAdmin')
}

export const isPremium: Access<User> = ({ req: { user } }) => {
  return Boolean(user?.roles === 'premiumUser')
}

export const isAdminOrSelf: Access<User> = ({ req: { user } }) => {
  if (user?.roles === 'superAdmin') {
    return true
  }

  if (user?.roles === 'admin') {
    return {
      roles: {
        not_equals: 'superAdmin',
      },
    } as Where
  }

  return {
    id: {
      equals: user?.id,
    },
  } as Where
}

export const canManageUser: Access<User> = ({ req: { user } }) => {
  if (user?.roles === 'superAdmin') {
    return true
  }

  if (user?.roles === 'admin') {
    return {
      roles: {
        not_equals: 'superAdmin',
      },
    } as Where
  }

  return {
    id: {
      equals: user?.id,
    },
  } as Where
}

export const canDeleteUser: Access<User> = ({ req: { user } }) => {
  if (user?.roles === 'superAdmin') {
    return true
  }

  if (user?.roles === 'admin') {
    return {
      roles: {
        not_equals: 'superAdmin',
      },
    } as Where
  }

  return false
}

export const isAdminFieldLevel: FieldAccess<User> = ({ req: { user } }) => {
  return Boolean(user?.roles === 'admin' || user?.roles === 'superAdmin')
}

export const isFirstUser: Access<User> = async ({ req }) => {
  const users = await req.payload.find({
    collection: 'users',
    limit: 0,
    depth: 0,
  })

  return users.totalDocs === 0
}

export const adminsAndFirstUser: FieldAccess<User> = async ({ req: { user }, req }) => {
  if (user?.roles === 'superAdmin') {
    return true
  }

  const users = await req.payload.find({
    collection: 'users',
    limit: 0,
    depth: 0,
  })

  return users.totalDocs === 0
}

export const canAccessAdminUI: ({ req }: { req: any }) => boolean = ({ req: { user } }) => {
  return Boolean(user?.roles === 'admin' || user?.roles === 'superAdmin')
}

export const canMutateRole: FieldAccess<User> = async ({ req: { user }, req, data }) => {
  // First user can do anything (bootstrapping)
  const isFirst = await isFirstUser({ req })
  if (isFirst) return true

  // Super Admin can do anything
  if (user?.roles === 'superAdmin') {
    return true
  }

  // Admin can only assign 'user' or 'premiumUser' roles
  if (user?.roles === 'admin') {
    // If they are trying to set 'superAdmin' or 'admin', deny
    if (data?.roles === 'superAdmin' || data?.roles === 'admin') {
      return false
    }
    return true
  }

  // Everyone else is denied
  return false
}

export const checkRolePermission =
  (resource: string, action: 'create' | 'read' | 'update' | 'delete'): Access =>
  async ({ req: { user, payload } }) => {
    if (user?.roles === 'superAdmin') {
      return true
    }

    if (!user?.roles) {
      return false
    }

    const permissionDocs = await payload.find({
      collection: 'permissions',
      where: {
        role: {
          equals: user.roles,
        },
      },
      limit: 1,
    })

    if (permissionDocs.totalDocs === 0) {
      return false
    }

    const permission = permissionDocs.docs[0]
    const resourcePermission = permission.resources?.find((r) => r.name === resource)

    if (!resourcePermission) {
      return false
    }

    return resourcePermission.actions?.includes(action) || false
  }
