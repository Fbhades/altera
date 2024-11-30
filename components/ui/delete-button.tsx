import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  onClick: () => void;
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button variant="destructive" size="sm" onClick={onClick}>
      <Trash2 className="w-4 h-4 mr-2" />
      Delete
    </Button>
  )
}
