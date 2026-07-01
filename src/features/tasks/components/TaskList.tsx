import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useCompleteTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useIncompleteTaskMutation,
  useUpdateTaskMutation
} from '../api/tasksApi';
import type { Task, TaskFilterValue } from '../types';
import BulkActions from './BulkActions';
import NewTaskForm from './NewTaskForm';
import TaskFilter from './TaskFilter';
import TaskItem from './TaskItem';
import Loader from '@/components/Loader';
import { toast } from 'sonner';

const filterTasks = (tasks: Task[], filter: TaskFilterValue) => {
  if (filter === 'active') {
    return tasks.filter((task) => !task.completed);
  }

  if (filter === 'completed') {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
};

export function TaskList() {
  const { t } = useTranslation();

  const [filter, setFilter] = useState<TaskFilterValue>('all');
  const [pendingIds, setPendingIds] = useState<Set<Task['id']>>(() => new Set());
  const [isTogglingAll, setIsTogglingAll] = useState(false);
  const [isDeletingCompleted, setIsDeletingCompleted] = useState(false);

  const { data: tasks = [], isLoading, isFetching, isError, refetch } = useGetTasksQuery();
  const [completeTask] = useCompleteTaskMutation();
  const [incompleteTask] = useIncompleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const filteredTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks]);
  const activeTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);

  const completedCount = completedTasks.length;
  const activeCount = activeTasks.length;
  const allCompleted = tasks.length > 0 && activeCount === 0;

  const setTaskPending = (ids: Task['id'][], pending: boolean) => {
    setPendingIds((previousIds) => {
      const nextIds = new Set(previousIds);
      ids.forEach((id) => {
        if (pending) {
          nextIds.add(id);
        } else {
          nextIds.delete(id);
        }
      });
      return nextIds;
    });
  };

  const handleCompletedChange = async (task: Task) => {
    setTaskPending([task.id], true);

    try {
      if (task.completed) {
        await incompleteTask(task.id).unwrap();
      } else {
        await completeTask(task.id).unwrap();
      }
    } catch {
      toast.error(t('tasks.error.statusUpdate'));
    } finally {
      setTaskPending([task.id], false);
    }
  };

  const handleToggleAllCompleted = async (completed: boolean) => {
    const targetTasks = completed ? activeTasks : completedTasks;

    if (targetTasks.length === 0) {
      return;
    }

    const targetTaskIds = targetTasks.map((task) => task.id);

    setIsTogglingAll(true);
    setTaskPending(targetTaskIds, true);

    try {
      if (completed) {
        await Promise.all(targetTaskIds.map((taskId) => completeTask(taskId).unwrap()));
      } else {
        await Promise.all(targetTaskIds.map((taskId) => incompleteTask(taskId).unwrap()));
      }
    } catch {
      toast.error(t(completed ? 'tasks.error.completeAll' : 'tasks.error.incompleteAll'));
    } finally {
      setTaskPending(targetTaskIds, false);
      setIsTogglingAll(false);
    }
  };

  const handleRenameTask = async (task: Task, text: string) => {
    if (text === task.text) {
      return;
    }

    setTaskPending([task.id], true);

    try {
      await updateTask({ id: task.id, body: { text } }).unwrap();
    } catch {
      toast.error(t('tasks.error.updateText'));
    } finally {
      setTaskPending([task.id], false);
    }
  };

  const handleDeleteTask = async (taskId: Task['id']) => {
    setTaskPending([taskId], true);

    try {
      await deleteTask(taskId).unwrap();
    } catch {
      toast.error(t('tasks.error.delete'));
    } finally {
      setTaskPending([taskId], false);
    }
  };

  const handleDeleteCompleted = async () => {
    if (completedTasks.length === 0) {
      return;
    }

    const completedTaskIds = completedTasks.map((task) => task.id);

    setIsDeletingCompleted(true);
    setTaskPending(completedTaskIds, true);

    try {
      await Promise.all(completedTaskIds.map((taskId) => deleteTask(taskId).unwrap()));
    } catch {
      toast.error(t('tasks.error.deleteCompleted'));
    } finally {
      setTaskPending(completedTaskIds, false);
      setIsDeletingCompleted(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-row items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-normal">{t('tasks.heading')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('tasks.summary', { activeCount, completedCount })}
          </p>
        </div>
        <TaskFilter
          value={filter}
          totalCount={tasks.length}
          activeCount={activeCount}
          completedCount={completedCount}
          onChange={setFilter}
        />
      </div>

      <NewTaskForm />

      <BulkActions
        totalCount={tasks.length}
        activeCount={activeCount}
        completedCount={completedCount}
        allCompleted={allCompleted}
        onToggleAllCompleted={handleToggleAllCompleted}
        onDeleteCompleted={handleDeleteCompleted}
        isCompletingAll={isTogglingAll}
        isDeletingCompleted={isDeletingCompleted}
      />

      {isLoading && <Loader isCenter />}

      {isError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          <p>{t('tasks.error.load')}</p>
          <button className="mt-2 underline underline-offset-4" type="button" onClick={refetch}>
            {t('tasks.retry')}
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && filteredTasks.length === 0 ? (
        <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
          {t('tasks.empty')}
        </div>
      ) : null}

      {filteredTasks.length > 0 ? (
        <ul className="space-y-3" aria-busy={isFetching}>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isPending={pendingIds.has(task.id) || isTogglingAll || isDeletingCompleted}
              onCompletedChange={handleCompletedChange}
              onRename={handleRenameTask}
              onDelete={handleDeleteTask}
            />
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default TaskList;
