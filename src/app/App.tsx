import React from 'react';
import { Board } from './components/kanban/Board';
import { Column } from './components/kanban/Column';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes'; // Assuming it's set up, or skip if not

export default function App() {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
    >
      <div className="min-h-screen bg-background text-foreground">
        <main className="container mx-auto p-6 max-w-7xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Kanban Task Management</h1>
          <Board>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Board.Consumer>
                {(value) => (
                  <>
                    {value.board.columns.map((column) => (
                      <Column key={column.id} column={column} />
                    ))}
                  </>
                )}
              </Board.Consumer>
            </div>
          </Board>
        </main>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

