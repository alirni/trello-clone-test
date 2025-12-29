'use client';

import React, { useState } from 'react';
import { Card } from '@/types';
import { useBoardStore } from '@/store/useBoardStore';
import { MessageSquare, AlignLeft, Calendar, Trash2 } from 'lucide-react';
import EditableTitle from './EditableTitle';
import '../styles/components/card-details.scss';

interface CardDetailsProps {
  card: Card;
  listId: string;
  onClose: () => void;
}

const CardDetails: React.FC<CardDetailsProps> = ({ card, listId, onClose }) => {
  const { updateCardTitle, addComment, deleteComment } = useBoardStore();
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(listId, card.id, commentText.trim());
      setCommentText('');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="card-details">
      <header className="details-header">
        <div className="header-icon">
          <Calendar size={20} />
        </div>
        <div className="header-title">
          <EditableTitle
            title={card.title}
            onSave={(newTitle) => updateCardTitle(listId, card.id, newTitle)}
            className="card-title-edit"
          />
          <p className="list-context">in list <span>{useBoardStore.getState().board.lists.find(l => l.id === listId)?.title}</span></p>
        </div>
      </header>

      <section className="details-section description-section">
        <div className="section-header">
          <AlignLeft size={20} />
          <h3>Description</h3>
        </div>
        <div className="section-content">
          <p className="placeholder-text">Edit the description...</p>
        </div>
      </section>

      <section className="details-section activity-section">
        <div className="section-header">
          <MessageSquare size={20} />
          <h3>Activity</h3>
        </div>
        
        <div className="add-comment">
          <div className="comment-input-wrapper">
            <textarea
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
            />
            {commentText.trim() && (
              <button className="save-comment-btn" onClick={handleAddComment}>
                Save
              </button>
            )}
          </div>
        </div>

        <div className="comments-list">
          {card.comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="author-name">User</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <div className="comment-bubble">
                <p>{comment.text}</p>
              </div>
              <div className="comment-actions">
                <button 
                  onClick={() => deleteComment(listId, card.id, comment.id)}
                  className="delete-comment-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CardDetails;

