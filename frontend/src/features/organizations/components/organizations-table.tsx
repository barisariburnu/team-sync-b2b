import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { type Organization, deleteOrganization } from '@/services/organizations'

type OrganizationsTableProps = {
  data: Organization[]
  onChanged?: () => void
}

export function OrganizationsTable({ data, onChanged }: OrganizationsTableProps) {
  const [pendingId, setPendingId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    setPendingId(id)
    try {
      await toast.promise(deleteOrganization(id), {
        loading: 'Deleting organization…',
        success: 'Organization deleted',
        error: 'Failed to delete organization',
      })
      onChanged?.()
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className='hidden sm:table-cell'>ID</TableHead>
            <TableHead className='hidden lg:table-cell'>Created At</TableHead>
            <TableHead className='w-[80px]'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((org) => (
            <TableRow key={org.id}>
              <TableCell className='font-medium'>{org.name}</TableCell>
              <TableCell className='hidden sm:table-cell text-muted-foreground'>
                {org.id}
              </TableCell>
              <TableCell className='hidden lg:table-cell text-muted-foreground'>
                {org.createdAt ? new Date(org.createdAt).toLocaleString() : '—'}
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      aria-label='Delete organization'
                      disabled={pendingId === org.id}
                    >
                      <Trash2 className='size-4' />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete organization?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        the organization.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(org.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className='text-center text-muted-foreground'>
                No organizations found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}