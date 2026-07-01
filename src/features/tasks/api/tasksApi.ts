import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateTaskRequest, Task, UpdateTaskRequest } from '../types';

const sortByCreatedDate = (tasks: Task[]) => {
  tasks.sort((firstTask, secondTask) => firstTask.createdDate - secondTask.createdDate);
};

const upsertTask = (tasks: Task[], task: Task) => {
  const taskIndex = tasks.findIndex((currentTask) => currentTask.id === task.id);

  if (taskIndex === -1) {
    tasks.push(task);
  } else {
    tasks[taskIndex] = task;
  }

  sortByCreatedDate(tasks);
};

const removeTask = (tasks: Task[], taskId: Task['id']) => {
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
  }
};

const updateTaskText = (tasks: Task[], taskId: Task['id'], text: string) => {
  const task = tasks.find((currentTask) => currentTask.id === taskId);

  if (task) {
    task.text = text;
  }
};

const updateTaskCompletion = (tasks: Task[], taskId: Task['id'], completed: boolean) => {
  const task = tasks.find((currentTask) => currentTask.id === taskId);

  if (task) {
    task.completed = completed;
    task.completedDate = completed ? Date.now() : undefined;
  }
};

export const tasksApi = createApi({
  reducerPath: 'tasksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: ['Task']
    }),

    getCompletedTasks: builder.query<Task[], void>({
      query: () => '/tasks/completed',
      providesTags: ['Task']
    }),

    createTask: builder.mutation<Task, CreateTaskRequest>({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data: createdTask } = await queryFulfilled;

          dispatch(
            tasksApi.util.updateQueryData('getTasks', undefined, (draftTasks) => {
              upsertTask(draftTasks, createdTask);
            })
          );
        } catch {
          // cache nebyla zmenena, chybu zpracuje komponenta pres mutation state
        }
      }
    }),

    updateTask: builder.mutation<Task, { id: Task['id']; body: UpdateTaskRequest }>({
      query: ({ id, body }) => ({
        url: `/tasks/${id}`,
        method: 'POST',
        body
      }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patchResults = [
          dispatch(
            tasksApi.util.updateQueryData('getTasks', undefined, (draftTasks) => {
              updateTaskText(draftTasks, id, body.text);
            })
          ),
          dispatch(
            tasksApi.util.updateQueryData('getCompletedTasks', undefined, (draftTasks) => {
              updateTaskText(draftTasks, id, body.text);
            })
          )
        ];

        try {
          const { data: updatedTask } = await queryFulfilled;

          dispatch(
            tasksApi.util.updateQueryData('getTasks', undefined, (draftTasks) => {
              upsertTask(draftTasks, updatedTask);
            })
          );
          dispatch(
            tasksApi.util.updateQueryData('getCompletedTasks', undefined, (draftTasks) => {
              if (updatedTask.completed) {
                upsertTask(draftTasks, updatedTask);
              } else {
                removeTask(draftTasks, updatedTask.id);
              }
            })
          );
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      }
    }),

    completeTask: builder.mutation<Task, Task['id']>({
      query: (id) => ({
        url: `/tasks/${id}/complete`,
        method: 'POST'
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData('getTasks', undefined, (draftTasks) => {
            updateTaskCompletion(draftTasks, id, true);
          })
        );

        try {
          const { data: completedTask } = await queryFulfilled;

          dispatch(
            tasksApi.util.updateQueryData('getTasks', undefined, (draftTasks) => {
              upsertTask(draftTasks, completedTask);
            })
          );
          dispatch(
            tasksApi.util.updateQueryData('getCompletedTasks', undefined, (draftTasks) => {
              upsertTask(draftTasks, completedTask);
            })
          );
        } catch {
          patchResult.undo();
        }
      }
    }),

    incompleteTask: builder.mutation<Task, Task['id']>({
      query: (id) => ({
        url: `/tasks/${id}/incomplete`,
        method: 'POST'
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults = [
          dispatch(
            tasksApi.util.updateQueryData('getTasks', undefined, (draftTasks) => {
              updateTaskCompletion(draftTasks, id, false);
            })
          ),
          dispatch(
            tasksApi.util.updateQueryData('getCompletedTasks', undefined, (draftTasks) => {
              removeTask(draftTasks, id);
            })
          )
        ];

        try {
          const { data: incompleteTask } = await queryFulfilled;

          dispatch(
            tasksApi.util.updateQueryData('getTasks', undefined, (draftTasks) => {
              upsertTask(draftTasks, incompleteTask);
            })
          );
          dispatch(
            tasksApi.util.updateQueryData('getCompletedTasks', undefined, (draftTasks) => {
              removeTask(draftTasks, incompleteTask.id);
            })
          );
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      }
    }),

    deleteTask: builder.mutation<void, Task['id']>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE'
      }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResults = [
          dispatch(
            tasksApi.util.updateQueryData('getTasks', undefined, (draftTasks) => {
              removeTask(draftTasks, id);
            })
          ),
          dispatch(
            tasksApi.util.updateQueryData('getCompletedTasks', undefined, (draftTasks) => {
              removeTask(draftTasks, id);
            })
          )
        ];

        try {
          await queryFulfilled;
        } catch {
          patchResults.forEach((patchResult) => patchResult.undo());
        }
      }
    })
  })
});

export const {
  useGetTasksQuery,
  useGetCompletedTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useCompleteTaskMutation,
  useIncompleteTaskMutation,
  useDeleteTaskMutation
} = tasksApi;
