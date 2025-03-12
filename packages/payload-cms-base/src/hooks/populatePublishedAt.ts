import type { FieldHook } from 'payload/types'

export const populatePublishedAt: FieldHook = ({ value, operation, siblingData }) => {
  if (operation === 'create' || operation === 'update') {
    if (siblingData._status === 'published' && !value) {
      return new Date()
    }
  }

  return value
}
