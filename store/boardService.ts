import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { Board, List, Card } from '../types';

export const boardService = {
  updateBoardTitle: (board: Board, title: string): Board => ({
    ...board,
    title,
  }),

  addList: (board: Board, title: string): Board => ({
    ...board,
    lists: [...board.lists, { id: uuidv4(), title, cards: [] }],
  }),

  updateListTitle: (board: Board, listId: string, title: string): Board => ({
    ...board,
    lists: board.lists.map((list) =>
      list.id === listId ? { ...list, title } : list
    ),
  }),

  deleteList: (board: Board, listId: string): Board => ({
    ...board,
    lists: board.lists.filter((list) => list.id !== listId),
  }),

  deleteAllCardsInList: (board: Board, listId: string): Board => ({
    ...board,
    lists: board.lists.map((list) =>
      list.id === listId ? { ...list, cards: [] } : list
    ),
  }),

  deleteAllLists: (board: Board): Board => ({
    ...board,
    lists: [],
  }),

  addCard: (board: Board, listId: string, title: string): Board => ({
    ...board,
    lists: board.lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            cards: [
              ...list.cards,
              { id: uuidv4(), title, comments: [], createdAt: Date.now() },
            ],
          }
        : list
    ),
  }),

  updateCardTitle: (board: Board, listId: string, cardId: string, title: string): Board => ({
    ...board,
    lists: board.lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            cards: list.cards.map((card) =>
              card.id === cardId ? { ...card, title } : card
            ),
          }
        : list
    ),
  }),

  updateCardDescription: (board: Board, listId: string, cardId: string, description: string): Board => ({
    ...board,
    lists: board.lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            cards: list.cards.map((card) =>
              card.id === cardId ? { ...card, description } : card
            ),
          }
        : list
    ),
  }),

  deleteCard: (board: Board, listId: string, cardId: string): Board => ({
    ...board,
    lists: board.lists.map((list) =>
      list.id === listId
        ? {
            ...list,
            cards: list.cards.filter((card) => card.id !== cardId),
          }
        : list
    ),
  }),

  moveList: (board: Board, activeId: string, overId: string): Board => {
    const oldIndex = board.lists.findIndex((l) => l.id === activeId);
    const newIndex = board.lists.findIndex((l) => l.id === overId);
    return {
      ...board,
      lists: arrayMove(board.lists, oldIndex, newIndex),
    };
  },

  moveCard: (board: Board, activeId: string, overId: string, activeListId: string, overListId: string): Board => {
    const newLists = [...board.lists];
    const activeListIndex = newLists.findIndex((l) => l.id === activeListId);
    const overListIndex = newLists.findIndex((l) => l.id === overListId);

    if (activeListIndex === -1 || overListIndex === -1) return board;

    const activeList = { ...newLists[activeListIndex], cards: [...newLists[activeListIndex].cards] };
    const overList = activeListId === overListId ? activeList : { ...newLists[overListIndex], cards: [...newLists[overListIndex].cards] };

    const activeCardIndex = activeList.cards.findIndex((c) => c.id === activeId);
    if (activeCardIndex === -1) return board;

    if (activeListId === overListId) {
      const overCardIndex = activeList.cards.findIndex((c) => c.id === overId);
      if (overCardIndex === -1 || activeCardIndex === overCardIndex) return board;
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

    return { ...board, lists: newLists };
  },

  addComment: (board: Board, listId: string, cardId: string, text: string): Board => ({
    ...board,
    lists: board.lists.map((list) =>
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
  }),

  deleteComment: (board: Board, listId: string, cardId: string, commentId: string): Board => ({
    ...board,
    lists: board.lists.map((list) =>
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
  }),
};

