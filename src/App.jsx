import { useState, useEffect, useRef } from 'react';
import { getCardData } from './data/cardsData';
import './App.css';

export default function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const numberOfCards = 8; // Match this with your API call

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const result = await getCardData(numberOfCards);
        setCards(result);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch cards:", err);
        setError("Failed to load cards. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [numberOfCards]);

  return (
    <>
      <Header />
      {loading ? (
        <div className="loading">Loading cards...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <GameCore cards={cards} numberOfCards={numberOfCards} />
      )}
    </>
  );
}

function Header() {
  const handleBack = () => {
    // Implement back functionality or remove if not needed
    console.log("Back button clicked");
  };

  return (
    <div className="header">
      <button className="back" onClick={handleBack}>Back</button>
      <img src="/Yugioh-EN-DE.svg" alt="Anime logo" className="logo" />
    </div>
  );
}

function GameCore({ cards, numberOfCards }) {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  return (
    <div className="game-container">
      <CardsPlay 
        cards={cards} 
        numberOfCards={numberOfCards}
        onScoreUpdate={(newScore) => {
          setScore(newScore);
          if (newScore > highScore) {
            setHighScore(newScore);
          }
        }}
      />
      <div className="score-statics">
        <h4>Current Score: {score}</h4>
        <h4>Highest Score: {highScore}</h4>
      </div>
    </div>
  );
}

function CardsPlay({ cards, onScoreUpdate }) {
  const [clickedCrads, setClickedCards] = useState(new Set([]))
  const [styleCard, setStyleCard] = useState({ width: "inherit" });
  const [styleBack, setStyleBack] = useState({ width: "inherit" });
  const [shuffledCards, setShuffledCards] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (cards && cards.length > 0) {
      setShuffledCards([...cards]);
      console.log("Cards loaded:", cards.length);
    }
  }, [cards]);
  
  const shuffleArray = (arr) => {
    return [...arr]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };
  
  const handleCardClick = (event) => {
    if (clickedCrads.has(event.currentTarget.dataset.id)){
      console.log("")
    }else{
      const newClickedCard = new Set([...clickedCrads])
    newClickedCard.add(event.currentTarget.dataset.id)
    setClickedCards(newClickedCard)
    if (isAnimating || !shuffledCards.length) return; 
    console.log("the clicked cards are ", clickedCrads)
    setIsAnimating(true);
    console.log("Starting card flip animation...");
    }
    const newClickedCard = new Set([...clickedCrads])
    newClickedCard.add(event.currentTarget.dataset.id)
    setClickedCards(newClickedCard)
    if (isAnimating || !shuffledCards.length) return; 
    console.log("the clicked cards are ", clickedCrads)
    setIsAnimating(true);
    console.log("Starting card flip animation...");
    
    setStyleCard({
      width: "inherit",
      willChange: "transform",
      animation: "flipCard 0.4s forwards, changeToBack 0.4s forwards",
    });
    
    setStyleBack({
      width: "inherit",
      animation: "flipCard 0.4s forwards",
      willChange: "transform",
    });
    
    setTimeout(() => {
      console.log("Cards are face down, shuffling now...");
      setShuffledCards(shuffleArray(shuffledCards));
      
      setStyleCard({
        width: "inherit",
        willChange: "transform",
        animation: "flipCardBack 0.4s forwards, changeToBackBack 0.4s forwards",
      });
      
      setStyleBack({
        width: "inherit",
        animation: "flipCardBack 0.4s forwards, changeToFrontBack 0.4s forwards",
        willChange: "transform",
      });
      
      onScoreUpdate && onScoreUpdate(prev => prev + 1);
    }, 600);
    
    setTimeout(() => {
      setStyleCard({ width: "inherit" });
      setStyleBack({ width: "inherit" });
      setIsAnimating(false);
    }, 1000);
  };

  if (shuffledCards.length === 0) {
    return <div className="cards-loading">Preparing cards...</div>;
  }

  return (
    <div className="cards">
      {shuffledCards.map((card, index) => (
        <div 
          className="card" 
          key={card.id}
          data-id={card.id}  // Changed from dataset to data-id for clarity
          onClick={handleCardClick}>
          <img
            src="/dal6wsb-fc4aaba4-d6ff-4029-a83f-9b518abd511d.png"
            alt="Back of card"
            className="back-side"
            style={styleBack}/>
          {card.url && (
            <img 
              src={card.url} 
              alt={card.name || "Card"} 
              className="card-image" 
              style={styleCard}
              onError={(e) => {
                console.error("Failed to load card image:", card.url);
                e.target.src = "/placeholder-card.png"; // Fallback image
              }} 
            />
          )}
        </div>
      ))}
    </div>
  );
}