import { Button } from "@/components/ui/button"
import { Edit } from 'lucide-react'

interface UpdateButtonProps {
  onClick: () => void;
}

export function UpdateButton({ onClick }: UpdateButtonProps) {
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <Edit className="w-4 h-4 mr-2" />
      Update
    </Button>
  )
}
