import { useState, useEffect, useRef} from 'react';
import { getCardData } from './data/cardsData';
import './App.css';


export default function App() {
  const [cards, setCards] = useState([]);
  const [numberOfCards, setNumberOfCards] = useState(15);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const result = await getCardData(8);
        setCards(result);
      } catch (err) {
        throw new Error("No cards to retrieve. Something went wrong.");
      }
    };

    fetchCards();
  }, []);

  return (
    <>
      <Header />
      <GameCore cards={cards} numberOfCards={numberOfCards} />
    </>
  );
}

function Header() {
  return (
    <div className="header">
      <button className="back">Back</button>
      <img src="../public/Yugioh-EN-DE.svg" alt="Anime logo" className="logo" />
    </div>
  );
}

function GameCore({ cards, numberOfCards }) {
  return (
    <div className="game-container">
      <CardsPlay cards={cards} numberOfCards={numberOfCards} />
      <div className="score-statics">
        <h4>Current Score</h4>
        <h4>Highest Score</h4>
      </div>
    </div>
  );
}

function CardsPlay({ cards }) {
  const [styleCard, setStyleCard] = useState({ width: "inherit" });
  const [styleBack, setStyleBack] = useState({ width: "inherit" });
  const [shuffledCards, setShuffledCards] = useState([...cards]);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Function to shuffle an array
  const shuffleArray = (arr) => {
    return [...arr]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };
  
  const handleCardClick = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation
    
    setIsAnimating(true);
    console.log("Starting card flip animation...");
    
    // First animation: flip cards to back
    setStyleCard({
      ...styleCard,
      willChange: "transform",
      animation: "flipCard 0.4s forwards, changeToBack 0.4s forwards",
    });
    
    setStyleBack({
      ...styleBack,
      animation: "flipCard 0.4s forwards",
      willChange: "transform",
    });
    
    // Shuffle the cards when they're face down (after the first flip)
    setTimeout(() => {
      console.log("Cards are face down, shuffling now...");
      setShuffledCards(shuffleArray([...shuffledCards]));
      
      // Second animation: flip cards back to front
      setStyleCard({
        ...styleCard,
        willChange: "transform",
        animation: "flipCardBack 0.4s forwards, changeToBackBack 0.4s forwards",
      });
      
      setStyleBack({
        ...styleBack,
        animation: "flipCardBack 0.4s forwards, changeToFrontBack 0.4s forwards",
        willChange: "transform",
      });
    }, 650);
    
    // Reset animations after everything completes
    setTimeout(() => {
      setStyleCard({ width: "inherit" });
      setStyleBack({ width: "inherit" });
      setIsAnimating(false);
    }, 1000); // Total animation time (0.4s + 0.4s)
  };

  return (
    <div className="cards">
      {shuffledCards.map((card, index) => (
        <div 
          className="card" 
          key={card.id || `card-${index}`} 
          onClick={handleCardClick}
        >
          <img
            src="../public/dal6wsb-fc4aaba4-d6ff-4029-a83f-9b518abd511d.png"
            alt="Back of card"
            className="back-side"
            style={styleBack}
          />
          <img 
            src={card.url} 
            alt="Card" 
            className="card-image" 
            style={styleCard} 
          />
        </div>
      ))}
    </div>
  );
}