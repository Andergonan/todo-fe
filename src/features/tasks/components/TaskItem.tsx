import { Delete02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Task } from '../types';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const DOUBLE_TAP_DELAY_MS = 350;

type TaskItemProps = {
  task: Task;
  isPending: boolean;
  onCompletedChange: (task: Task) => void;
  onRename: (task: Task, text: string) => Promise<void>;
  onDelete: (taskId: Task['id']) => void;
};

const formatTaskDate = (timestamp: number | undefined, locale: string, emptyLabel: string) => {
  if (typeof timestamp !== 'number') {
    return emptyLabel;
  }

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium'
  }).format(new Date(timestamp));
};

export function TaskItem({
  task,
  isPending,
  onCompletedChange,
  onRename,
  onDelete
}: TaskItemProps) {
  const { i18n, t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(task.text);
  const [isSaving, setIsSaving] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const lastTouchTapTimeRef = useRef(0);

  const isTaskLocked = isPending || isSaving;

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    if (isTaskLocked) {
      return;
    }

    setDraftText(task.text);
    setIsEditing(true);
  };

  const saveEdit = async () => {
    if (isSaving) {
      return;
    }

    const trimmedText = draftText.trim();

    if (!trimmedText || trimmedText === task.text) {
      setDraftText(task.text);
      setIsEditing(false);
      return;
    }

    setIsSaving(true);

    try {
      await onRename(task, trimmedText);
      setIsEditing(false);
    } catch {
      inputRef.current?.focus();
    } finally {
      setIsSaving(false);
    }
  };

  const cancelEdit = () => {
    setDraftText(task.text);
    setIsEditing(false);
  };

  const handleEditKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveEdit();
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      cancelEdit();
    }
  };

  const handleTaskPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') {
      return;
    }

    const now = event.timeStamp;
    const isDoubleTap =
      lastTouchTapTimeRef.current > 0 && now - lastTouchTapTimeRef.current <= DOUBLE_TAP_DELAY_MS;

    lastTouchTapTimeRef.current = isDoubleTap ? 0 : now;

    if (isDoubleTap) {
      event.preventDefault();
      startEditing();
    }
  };

  return (
    <li
      className={cn(
        'rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors',
        task.completed && 'bg-muted/40 text-muted-foreground'
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          disabled={isTaskLocked}
          onCheckedChange={() => onCompletedChange(task)}
          className="mt-1"
        />

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1 space-y-2">
              {isEditing ? (
                <Input
                  ref={inputRef}
                  value={draftText}
                  disabled={isTaskLocked}
                  onBlur={() => void saveEdit()}
                  onChange={(event) => setDraftText(event.target.value)}
                  onKeyDown={handleEditKeyDown}
                  className="h-8 rounded-md px-2 text-base font-medium"
                />
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        'taskItem-task-button block w-full touch-manipulation rounded-md text-left text-base font-medium leading-6 outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60',
                        task.completed && 'text-muted-foreground line-through'
                      )}
                      disabled={isTaskLocked}
                      onDoubleClick={startEditing}
                      onPointerUp={handleTaskPointerUp}
                    >
                      {task.text}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="start" className="hidden sm:block">
                    <p>{t('tasks.editTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <div className="cursor-default flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-md bg-muted px-2 py-1">
                  {t('tasks.created')}:{' '}
                  {formatTaskDate(task.createdDate, i18n.language, t('tasks.notCompleted'))}
                </span>
                <span className="rounded-md bg-muted px-2 py-1">
                  {t('tasks.completedDate')}:{' '}
                  {formatTaskDate(task.completedDate, i18n.language, t('tasks.notCompleted'))}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => onDelete(task.id)}
              disabled={isTaskLocked}
            >
              <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default TaskItem;
