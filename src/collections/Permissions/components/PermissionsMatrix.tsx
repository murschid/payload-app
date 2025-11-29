'use client'

import { useConfig, useField } from '@payloadcms/ui'
import React from 'react'

type Action = 'create' | 'read' | 'update' | 'delete'
const actions: Action[] = ['create', 'read', 'update', 'delete']

type ResourcePermission = {
  name: string
  actions: Action[]
}

export const PermissionsMatrix: React.FC<{ path: string }> = ({ path }) => {
  const { config } = useConfig()
  const { value, setValue } = useField<ResourcePermission[]>({ path })

  if (!config) return null

  const collections = config.collections.filter((c) => c.slug !== 'permissions') // Exclude permissions itself if needed, or keep it

  const isChecked = (slug: string, action: Action) => {
    const resource = Array.isArray(value) ? value.find((r) => r.name === slug) : undefined
    return resource?.actions?.includes(action) || false
  }

  const toggleAction = (slug: string, action: Action) => {
    const currentValue = Array.isArray(value) ? value : []
    const resourceIndex = currentValue.findIndex((r) => r.name === slug)

    if (resourceIndex === -1) {
      // Add new resource with action
      setValue([...currentValue, { name: slug, actions: [action] }])
    } else {
      const resource = currentValue[resourceIndex]
      const actionIndex = resource.actions.indexOf(action)

      let newActions
      if (actionIndex === -1) {
        // Add action
        newActions = [...resource.actions, action]
      } else {
        // Remove action
        newActions = resource.actions.filter((a) => a !== action)
      }

      const newValue = [...currentValue]
      if (newActions.length === 0) {
        // Remove resource if no actions left
        newValue.splice(resourceIndex, 1)
      } else {
        // Update actions
        newValue[resourceIndex] = { ...resource, actions: newActions }
      }
      setValue(newValue)
    }
  }

  const toggleAll = (slug: string) => {
    const resource = Array.isArray(value) ? value.find((r) => r.name === slug) : undefined
    const allSelected = actions.every((a) => resource?.actions?.includes(a))

    if (allSelected) {
      // Deselect all
      const newValue = (Array.isArray(value) ? value : []).filter((r) => r.name !== slug)
      setValue(newValue)
    } else {
      // Select all
      const currentValue = Array.isArray(value) ? value : []
      const resourceIndex = currentValue.findIndex((r) => r.name === slug)

      const newValue = [...currentValue]
      if (resourceIndex === -1) {
        newValue.push({ name: slug, actions: [...actions] })
      } else {
        newValue[resourceIndex] = { ...currentValue[resourceIndex], actions: [...actions] }
      }
      setValue(newValue)
    }
  }

  return (
    <div className="field-type">
      <label className="field-label">Permissions Matrix</label>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>Collection</th>
              {actions.map((action) => (<th key={action} style={{ textAlign: 'center', padding: '10px', textTransform: 'capitalize' }}>{action}</th>))}
              <th style={{ textAlign: 'center', padding: '10px' }}>Select All</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => {
              const resource = Array.isArray(value) ? value.find((r) => r.name === collection.slug) : undefined
              const allSelected = actions.every((a) => resource?.actions?.includes(a))

              return (
                <tr key={collection.slug} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '10px', fontWeight: 'bold' }}>
                    {(typeof collection.labels === 'string' ? collection.labels : typeof collection.labels?.singular === 'string' ? collection.labels.singular : collection.slug)}
                  </td>
                  {actions.map((action) => (
                    <td key={action} style={{ textAlign: 'center', padding: '10px' }}>
                      <input type="checkbox" checked={isChecked(collection.slug, action)} onChange={() => toggleAction(collection.slug, action)} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                    </td>
                  ))}
                  <td style={{ textAlign: 'center', padding: '10px' }}>
                    <input type="checkbox" checked={allSelected} onChange={() => toggleAll(collection.slug)} style={{ cursor: 'pointer', width: '18px', height: '18px' }} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
