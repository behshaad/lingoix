import React, { useState } from "react";
import Flashcard from "./Flashcardanki";
import "./anki.css";

function Test() {
  const [cards, setCards] = useState([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleAddCard = (e) => {
    e.preventDefault();
    if (front && back) {
      setCards([...cards, { front, back }]);
      setFront("");
      setBack("");
    }
  };

  const nextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  return (
    <div className="app">
      <h1>Anki App</h1>

      <div className="card-container">
        {cards.length > 0 ? (
          <Flashcard
            front={cards[currentCardIndex].front}
            back={cards[currentCardIndex].back}
          />
        ) : (
          <p className="no-cards">
            No cards yet. Add some cards to get started!
          </p>
        )}
      </div>

      <div className="navigation">
        <button onClick={previousCard} disabled={currentCardIndex === 0}>
          Previous
        </button>
        <span className="card-counter">
          Card {currentCardIndex + 1} of {cards.length}
        </span>
        <button
          onClick={nextCard}
          disabled={currentCardIndex === cards.length - 1}
        >
          Next
        </button>
      </div>

      <form onSubmit={handleAddCard} className="add-card-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Front of card"
            value={front}
            onChange={(e) => setFront(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Back of card"
            value={back}
            onChange={(e) => setBack(e.target.value)}
          />
        </div>
        <button type="submit">Add Card</button>
      </form>
    </div>
  );
}

export default Test;
