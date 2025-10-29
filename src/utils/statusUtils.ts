export function getStatusLabel(status: string): string {
  switch (status) {
    case 'draft':
      return 'Draft'
    case 'published':
      return 'Published'
    case 'updated':
      return 'Published (unsaved changes)'
    default:
      return 'Unknown Status'
  }
}
