import { useState, useEffect, useRef } from 'react';
import { getCardData } from './data/cardsData';
import './App.css';

export default function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [highestScore, sethighestScore] = useState(0)
  const numberOfCards = 8;

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const result = await getCardData(20);
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
        <GameCore cards={cards} numberOfCards={numberOfCards} highScore={highestScore} setHighScore={sethighestScore}/>
      )}
    </>
  );
}

function Header() {

  return (
    <div className="header">
      <img src="/Yugioh-EN-DE.svg" alt="Anime logo" className="logo" />
    </div>
  );
}

function GameCore({ cards, numberOfCards, highScore, setHighScore}) {
  const [score, setScore] = useState(0);

  return (
    <div className="board">
        <img src="../public/Yugi.png" alt="" />
      <div className="game-container">
        <CardsPlay
          cards={cards}
          numberOfCards={numberOfCards}
          highScore={highScore}
          setHighScore={setHighScore}
          score={score}
          setScore={setScore}
        />
        <div className="score-statics">
          <h4>Current Score: {score} /20</h4>
          <h4>Highest Score: {highScore}</h4>
        </div>
      </div>
      <img src="../public/Kaiba.png" alt="" />
    </div>
    );
}

function CardsPlay({ cards, highScore, setHighScore, score, setScore}) {
  const [clickedCards, setClickedCards] = useState(new Set());
  const [shuffledCards, setShuffledCards] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const cardRefs = useRef({});
  const [pendingNewCards, setPendingNewCards] = useState(null);
  
  const [hoverStyles, setHoverStyles] = useState({});
  const [flipStyles, setFlipStyles] = useState({
    front: { width: "inherit" },
    back: { width: "inherit" }
  });

  useEffect(() => {
    if (cards && cards.length > 0 && !isAnimating && !shuffledCards.length) {
      const newShuffledCards = shuffleArray(cards).slice(0, 8);
      setShuffledCards(newShuffledCards);
    }
  }, [cards, isAnimating, shuffledCards.length]);
  
  useEffect(() => {
    if (pendingNewCards && !isAnimating) {
      setShuffledCards(pendingNewCards);
      setPendingNewCards(null);
    }
  }, [pendingNewCards, isAnimating]);
  
  const shuffleArray = (arr) => {
    return [...arr]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  const handleMouseEnter = (cardId) => {
    if (isAnimating) return;
    setHoveredCardId(cardId);
    setIsLeaving(false);
  };

  const handleMouseLeave = () => {
    if (isAnimating) return;
    
    setIsLeaving(true);
    
    setHoverStyles({
      transform: 'perspective(600px) rotateY(0deg) rotateX(0deg)',
      transition: 'transform 0.5s ease-out'
    });
    
    setTimeout(() => {
      if (isLeaving) {
        setHoveredCardId(null);
        setHoverStyles({});
      }
    }, 500);
  };

  const handleMouseMove = (event, cardId) => {
    if (isAnimating || isLeaving) return;
    
    const card = cardRefs.current[cardId];
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const mouseX = event.clientX - rect.left; 
    const mouseY = event.clientY - rect.top;
    
    const rotateY = ((mouseX - centerX) / centerX) * 15; 
    const rotateX = -((mouseY - centerY) / centerY) * 15;
    
    setHoverStyles({
      transform: `perspective(600px) rotateY(${-rotateY}deg) rotateX(${-rotateX}deg)`,
      transition: "transform 0.1s ease"
    });
  };
  
  const handleCardClick = (event) => {
    const cardId = event.currentTarget.dataset.id;
    
    if (clickedCards.has(cardId)) {

      if (score > highScore) {
        setHighScore(score);
      }
      setScore(0);
      setClickedCards(new Set());
    } else {

      setScore(score + 1);
      const newClickedCards = new Set(clickedCards);
      newClickedCards.add(cardId);
      setClickedCards(newClickedCards);
    }   
    

    if (isAnimating || !shuffledCards.length) return; 
    
    setIsAnimating(true);
    setHoveredCardId(null);
    setHoverStyles({});
    setIsLeaving(false);

    setFlipStyles({
      front: {
        width: "inherit",
        willChange: "transform",
        animation: "flipCard 0.4s forwards, changeToBack 0.4s forwards",
      },
      back: {
        width: "inherit",
        animation: "flipCard 0.4s forwards",
        willChange: "transform",
      }
    });


    setTimeout(() => {
      const newShuffledCards = shuffleArray(cards).slice(0, 8);
      setPendingNewCards(newShuffledCards);
      
      setTimeout(() => {
        setShuffledCards(newShuffledCards);
        setPendingNewCards(null);
        
        setFlipStyles({
          front: {
            width: "inherit",
            willChange: "transform",
            animation: "flipCardBack 0.4s forwards, changeToBackBack 0.4s forwards",
          },
          back: {
            width: "inherit",
            animation: "flipCardBack 0.4s forwards, changeToFrontBack 0.4s forwards",
            willChange: "transform",
          }
        });
      }, 200);
    }, 400);


    setTimeout(() => {
      setFlipStyles({
        front: { width: "inherit" },
        back: { width: "inherit" }
      });
      setIsAnimating(false);
    }, 1000);
  };

  if (shuffledCards.length === 0) {
    return <div className="cards-loading">Preparing cards...</div>;
  }

  return (
    <div className="cards">
      {shuffledCards.map((card) => {
        const isHovered = card.id === hoveredCardId;
        const cardStyle = isHovered ? hoverStyles : {};
        
        return (
          <div 
            className="card" 
            key={card.id}
            data-id={card.id}
            ref={el => cardRefs.current[card.id] = el}
            onMouseEnter={() => handleMouseEnter(card.id)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={(e) => handleMouseMove(e, card.id)}
            onClick={handleCardClick}
            style={cardStyle}>
            <img
              src="/dal6wsb-fc4aaba4-d6ff-4029-a83f-9b518abd511d.png"
              alt="Back of card"
              className="back-side"
              style={flipStyles.back}/>
            {card.url && (
              <img 
                src={card.url} 
                alt={card.name || "Card"} 
                className="card-image" 
                style={flipStyles.front}
                onError={(e) => {
                  console.error("Failed to load card image:", card.url);
                  e.target.src = "/placeholder-card.png"; 
                }} 
              />
            )}
          </div>
        );
      })}
    </div>
  );
}