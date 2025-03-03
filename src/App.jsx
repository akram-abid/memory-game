import { useState, useEffect } from 'react';
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
  const cardsOrder = [1, 2, 3, 4, 5, 6]

  const handleCardClick = () => {
    setStyleCard({
      ...styleCard,
      willChange: "transform",
      animation:
        "flipCard 0.4s forwards, changeToBack 0.4s forwards, flipCardBack 0.4s 0.7s forwards, changeToBackBack 0.4s 0.7s forwards",
    });
    setStyleBack({
      ...styleBack,
      animation:
        "flipCard 0.4s forwards, flipCardBack 0.4s 0.7s forwards, changeToFrontBack 0.4s 0.7s forwards",
      willChange: "transform",
    });
    setTimeout(() => {
      setStyleCard({ width: "inherit" });
      setStyleBack({ width: "inherit" });
    }, 1400);
  };

  return (
    <div className="cards">
      {cards.map((value, index) => (
        <div className="card" key={index} onClick={handleCardClick}>
          <img
            src="../public/dal6wsb-fc4aaba4-d6ff-4029-a83f-9b518abd511d.png"
            alt="Back of card"
            className="back-side"
            style={styleBack}
          />
          <img src={value.url} alt="Card" className="card-image" style={styleCard} />
        </div>
      ))}
    </div>
  );
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; 
  }
}