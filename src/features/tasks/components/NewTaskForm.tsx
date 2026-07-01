import { type FormEvent, useState } from 'react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateTaskMutation } from '../api/tasksApi';
import { toast } from 'sonner';

export function NewTaskForm() {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    try {
      await createTask({ text: trimmedText }).unwrap();
      setText('');
    } catch {
      toast.error(t('tasks.error.create'));
    }
  };

  return (
    <form className="flex gap-2 flex-row" onSubmit={handleSubmit}>
      <Input
        placeholder={t('tasks.newTaskPlaceholder')}
        value={text}
        onChange={(event) => setText(event.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !text.trim()}>
        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
        {t('tasks.addTask')}
      </Button>
    </form>
  );
}

export default NewTaskForm;
