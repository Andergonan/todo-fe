import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

type BulkActionsProps = {
  totalCount: number;
  activeCount: number;
  completedCount: number;
  allCompleted: boolean;
  onToggleAllCompleted: (completed: boolean) => void;
  onDeleteCompleted: () => void;
  isCompletingAll: boolean;
  isDeletingCompleted: boolean;
};

export function BulkActions({
  totalCount,
  activeCount,
  completedCount,
  allCompleted,
  onToggleAllCompleted,
  onDeleteCompleted,
  isCompletingAll,
  isDeletingCompleted
}: BulkActionsProps) {
  const { t } = useTranslation();

  const hasCompletedTasks = completedCount > 0;
  const isPending = isCompletingAll || isDeletingCompleted;
  const checked = completedCount > 0 && activeCount > 0 ? 'indeterminate' : allCompleted;

  return (
    <div className="flex min-h-9 flex-row items-center justify-between gap-3 py-2 text-card-foreground">
      <label className="flex items-center gap-2 text-sm font-medium">
        <Checkbox
          checked={checked}
          disabled={totalCount === 0 || isPending}
          onCheckedChange={(nextChecked) => onToggleAllCompleted(nextChecked === true)}
        />
        {t(allCompleted ? 'tasks.markAllIncomplete' : 'tasks.markAllCompleted')}
      </label>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onDeleteCompleted}
        disabled={!hasCompletedTasks || isPending}
      >
        <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
        {t('tasks.deleteCompleted', { count: completedCount })}
      </Button>
    </div>
  );
}

export default BulkActions;
