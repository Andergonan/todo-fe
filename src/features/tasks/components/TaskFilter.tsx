import { FilterIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { TaskFilterValue } from '../types';

const filterValues: TaskFilterValue[] = ['all', 'active', 'completed'];

type TaskFilterProps = {
  value: TaskFilterValue;
  totalCount: number;
  activeCount: number;
  completedCount: number;
  onChange: (value: TaskFilterValue) => void;
};

const isTaskFilterValue = (value: string): value is TaskFilterValue =>
  value === 'all' || value === 'active' || value === 'completed';

export function TaskFilter({
  value,
  totalCount,
  activeCount,
  completedCount,
  onChange
}: TaskFilterProps) {
  const { t } = useTranslation();
  const counts: Record<TaskFilterValue, number> = {
    all: totalCount,
    active: activeCount,
    completed: completedCount
  };

  const getFilterLabel = (filterValue: TaskFilterValue) => t(`tasks.filter.${filterValue}`);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <HugeiconsIcon icon={FilterIcon} strokeWidth={2} />
          {getFilterLabel(value)}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('tasks.filter.label')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(nextValue) => {
            if (isTaskFilterValue(nextValue)) {
              onChange(nextValue);
            }
          }}
        >
          {filterValues.map((filterValue) => (
            <DropdownMenuRadioItem
              key={filterValue}
              value={filterValue}
              className="dropdownMenuItem"
            >
              <span>{getFilterLabel(filterValue)}</span>
              <span className="ml-auto text-xs text-muted-foreground">{counts[filterValue]}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TaskFilter;
