import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Board, BoardState } from '../types';
import { boardService } from './boardService';

const initialData: Board = {
  id: 'board-1',
  title: 'Demo Board',
  lists: [
    {
      id: 'list-1',
      title: 'To Do',
      cards: [
        {
          id: 'card-1',
          title: 'Project Setup',
          comments: [],
          createdAt: Date.now(),
        },
      ],
    },
    {
      id: 'list-2',
      title: 'In Progress',
      cards: [],
    },
    {
      id: 'list-3',
      title: 'Done',
      cards: [],
    },
  ],
};

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      board: initialData,

      setBoard: (board) => set({ board }),

      updateBoardTitle: (title) =>
        set((state) => ({ board: boardService.updateBoardTitle(state.board, title) })),

      addList: (title) =>
        set((state) => ({ board: boardService.addList(state.board, title) })),

      updateListTitle: (listId, title) =>
        set((state) => ({ board: boardService.updateListTitle(state.board, listId, title) })),

      deleteList: (listId) =>
        set((state) => ({ board: boardService.deleteList(state.board, listId) })),

      deleteAllCardsInList: (listId) =>
        set((state) => ({ board: boardService.deleteAllCardsInList(state.board, listId) })),

      deleteAllLists: () =>
        set((state) => ({ board: boardService.deleteAllLists(state.board) })),

      addCard: (listId, title) =>
        set((state) => ({ board: boardService.addCard(state.board, listId, title) })),

      updateCardTitle: (listId, cardId, title) =>
        set((state) => ({ board: boardService.updateCardTitle(state.board, listId, cardId, title) })),

      updateCardDescription: (listId, cardId, description) =>
        set((state) => ({ board: boardService.updateCardDescription(state.board, listId, cardId, description) })),

      deleteCard: (listId, cardId) =>
        set((state) => ({ board: boardService.deleteCard(state.board, listId, cardId) })),

      moveList: (activeId, overId) =>
        set((state) => ({ board: boardService.moveList(state.board, activeId, overId) })),

      moveCard: (activeId, overId, activeListId, overListId) =>
        set((state) => ({ board: boardService.moveCard(state.board, activeId, overId, activeListId, overListId) })),

      addComment: (listId, cardId, text) =>
        set((state) => ({ board: boardService.addComment(state.board, listId, cardId, text) })),

      deleteComment: (listId, cardId, commentId) =>
        set((state) => ({ board: boardService.deleteComment(state.board, listId, cardId, commentId) })),
    }),
    {
      name: 'trello-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
