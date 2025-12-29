import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { Board, BoardState } from '../types';

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
        set((state) => ({
          board: { ...state.board, title },
        })),

      addList: (title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: [
              ...state.board.lists,
              { id: uuidv4(), title, cards: [] },
            ],
          },
        })),

      updateListTitle: (listId, title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId ? { ...list, title } : list
            ),
          },
        })),

      deleteList: (listId) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.filter((list) => list.id !== listId),
          },
        })),

      deleteAllLists: () =>
        set((state) => ({
          board: {
            ...state.board,
            lists: [],
          },
        })),

      addCard: (listId, title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: [
                      ...list.cards,
                      {
                        id: uuidv4(),
                        title,
                        comments: [],
                        createdAt: Date.now(),
                      },
                    ],
                  }
                : list
            ),
          },
        })),

      updateCardTitle: (listId, cardId, title) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.map((card) =>
                      card.id === cardId ? { ...card, title } : card
                    ),
                  }
                : list
            ),
          },
        })),

      updateCardDescription: (listId, cardId, description) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.map((card) =>
                      card.id === cardId ? { ...card, description } : card
                    ),
                  }
                : list
            ),
          },
        })),

      deleteCard: (listId, cardId) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.filter((card) => card.id !== cardId),
                  }
                : list
            ),
          },
        })),

      moveList: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.board.lists.findIndex((l) => l.id === activeId);
          const newIndex = state.board.lists.findIndex((l) => l.id === overId);
          return {
            board: {
              ...state.board,
              lists: arrayMove(state.board.lists, oldIndex, newIndex),
            },
          };
        }),

      moveCard: (activeId, overId, activeListId, overListId) =>
        set((state) => {
          const newLists = [...state.board.lists];
          const activeListIndex = newLists.findIndex((l) => l.id === activeListId);
          const overListIndex = newLists.findIndex((l) => l.id === overListId);

          if (activeListIndex === -1 || overListIndex === -1) return state;

          const activeList = { ...newLists[activeListIndex], cards: [...newLists[activeListIndex].cards] };
          const overList = activeListId === overListId ? activeList : { ...newLists[overListIndex], cards: [...newLists[overListIndex].cards] };

          const activeCardIndex = activeList.cards.findIndex((c) => c.id === activeId);
          if (activeCardIndex === -1) return state;

          if (activeListId === overListId) {
            const overCardIndex = activeList.cards.findIndex((c) => c.id === overId);
            if (overCardIndex === -1 || activeCardIndex === overCardIndex) return state;
            
            activeList.cards = arrayMove(activeList.cards, activeCardIndex, overCardIndex);
            newLists[activeListIndex] = activeList;
          } else {
            const [movedCard] = activeList.cards.splice(activeCardIndex, 1);
            const overCardIndex = overList.cards.findIndex((c) => c.id === overId);
            
            if (overCardIndex !== -1) {
              overList.cards.splice(overCardIndex, 0, movedCard);
            } else {
              overList.cards.push(movedCard);
            }
            
            newLists[activeListIndex] = activeList;
            newLists[overListIndex] = overList;
          }

          return { board: { ...state.board, lists: newLists } };
        }),

      addComment: (listId, cardId, text) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.map((card) =>
                      card.id === cardId
                        ? {
                            ...card,
                            comments: [
                              ...card.comments,
                              { id: uuidv4(), text, createdAt: Date.now() },
                            ],
                          }
                        : card
                    ),
                  }
                : list
            ),
          },
        })),

      deleteComment: (listId, cardId, commentId) =>
        set((state) => ({
          board: {
            ...state.board,
            lists: state.board.lists.map((list) =>
              list.id === listId
                ? {
                    ...list,
                    cards: list.cards.map((card) =>
                      card.id === cardId
                        ? {
                            ...card,
                            comments: card.comments.filter((c) => c.id !== commentId),
                          }
                        : card
                    ),
                  }
                : list
            ),
          },
        })),
    }),
    {
      name: 'trello-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

