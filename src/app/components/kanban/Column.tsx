import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useDrop } from 'react-dnd';
import { TaskCard } from './TaskCard';
import { Column as ColumnType } from '../../types/kanban';
import { useKanban } from './Board';

interface ColumnProps {
  column: ColumnType;
}

export function Column({ column }: ColumnProps) {
  const { moveTask } = useKanban();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'task',
    drop: (item: any, monitor) => {
      const task = item.task;
      if (task.status !== column.id) {
        moveTask(task.id, column.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const addTask = () => {
    // Trigger modal - simplified, use context later
    console.log('Add task to', column.title);
  };

  return (
    <Card ref={drop} className={`min-h-[300px] flex-1 ${isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold capitalize">{column.title} ({column.tasks.length})</CardTitle>
        <Button variant="ghost" size="sm" onClick={addTask}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 p-0 max-h-[500px] overflow-y-auto">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </CardContent>
    </Card>
  );
}

