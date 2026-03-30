import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Column } from './Column';
import { TaskModal } from './TaskModal';
import { Task, Column as ColumnType, Board as BoardType } from '../../types/kanban';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '../ui/sonner';

interface KanbanContextType {
  board: BoardType;
  moveTask: (taskId: string, newStatus: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  createTask: (title: string, description?: string, status?: string) => void;
  children?: ReactNode;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export function useKanban() {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within Board');
  }
  return context;
}

export function Board({ children }: { children?: ReactNode }) {
  const [board, setBoard] = useState<BoardType>({
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        tasks: [
          { id: '1', title: 'Welcome to Kanban!', status: 'todo' as const },
          { id: '2', title: 'Learn React DnD', status: 'todo' as const },
        ],
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        tasks: [{ id: '3', title: 'Build columns', description: 'Use shadcn cards', status: 'in-progress' as const }],
      },
      {
        id: 'done',
        title: 'Done',
        tasks: [],
      },
    ],
  });

  const toast = useToast();

  const moveTask = (taskId: string, newStatus: string) => {
    setBoard((prev) => {
      const newBoard = JSON.parse(JSON.stringify(prev)) as BoardType;
      const task = findTask(newBoard.columns, taskId);
      if (task) {
        const oldColumn = newBoard.columns.find((col) => col.id === task.status);
        const newColumn = newBoard.columns.find((col) => col.id === newStatus);
        if (oldColumn && newColumn && oldColumn !== newColumn) {
          oldColumn.tasks = oldColumn.tasks.filter((t) => t.id !== taskId);
          task.status = newStatus as Task['status'];
          newColumn.tasks.push(task);
        }
      }
      return newBoard;
    });
    toast.success('Task moved');
  };

  const createTask = (title: string, description?: string, status = 'todo') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: status as Task['status'],
    };
    setBoard((prev) => {
      const newBoard = JSON.parse(JSON.stringify(prev)) as BoardType;
      const column = newBoard.columns.find((col) => col.id === status);
      if (column) {
        column.tasks.push(newTask);
      }
      return newBoard;
    });
    toast.success('Task created');
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setBoard((prev) => {
      const newBoard = JSON.parse(JSON.stringify(prev)) as BoardType;
      const task = findTask(newBoard.columns, taskId);
      if (task) {
        Object.assign(task, updates);
      }
      return newBoard;
    });
    toast.success('Task updated');
  };

  const deleteTask = (taskId: string) => {
    setBoard((prev) => {
      const newBoard = JSON.parse(JSON.stringify(prev)) as BoardType;
      const column = newBoard.columns.find((col) => 
        col.tasks.some((t) => t.id === taskId)
      );
      if (column) {
        column.tasks = column.tasks.filter((t) => t.id !== taskId);
      }
      return newBoard;
    });
  };

  return (
    <KanbanContext.Provider value={{ board, moveTask, createTask, updateTask, deleteTask }}>
      <DndProvider backend={HTML5Backend}>
        {children}
      </DndProvider>
      <TaskModal task={undefined} isOpen={false} onClose={() => {}} /> {/* Placeholder, use state in parent */}
    </KanbanContext.Provider>
  );
}

function findTask(columns: ColumnType[], taskId: string): Task | undefined {
  for (const column of columns) {
    const task = column.tasks.find((t) => t.id === taskId);
    if (task) return task;
  }
  return undefined;
}

