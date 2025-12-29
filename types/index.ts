export interface Comment {
  id: string;
  text: string;
  createdAt: number;
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  comments: Comment[];
  createdAt: number;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  lists: List[];
}

export interface BoardState {
  board: Board;
  setBoard: (board: Board) => void;
  updateBoardTitle: (title: string) => void;
  addList: (title: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  deleteList: (listId: string) => void;
  addCard: (listId: string, title: string) => void;
  updateCardTitle: (listId: string, cardId: string, title: string) => void;
  deleteCard: (listId: string, cardId: string) => void;
  moveList: (activeId: string, overId: string) => void;
  moveCard: (
    activeId: string,
    overId: string,
    activeListId: string,
    overListId: string
  ) => void;
  addComment: (listId: string, cardId: string, text: string) => void;
  deleteComment: (listId: string, cardId: string, commentId: string) => void;
}

