import type { ListViewServerProps } from 'payload'

// Server component for custom users list view
export default async function CustomUsersListView(props: ListViewServerProps) {
  // You can log props for debugging (server-side only)
  console.log(props.data)
  return <div>Custom Users List View</div>
}
