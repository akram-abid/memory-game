import { useState, useEffect } from 'react';
import { getCardData } from './data/cardsData';
import './App.css';

function App() {
  return (
    <>
      <CardGallery />
      <img 
        src="https://s4.anilist.co/file/anilistcdn/character/large/b17-IazKGogQwJ1p.png" 
        alt="fvs" 
      />
    </>
  );
}

export default function CardGallery() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const numberOfCards = 30;

    const fetchCards = async () => {
      try {
        setLoading(true);
        const result = await getCardData(numberOfCards);
        setCards(result);
      } catch (err) {
        setError("Failed to load cards");
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  console.log("finnaly ",cards[0])
  
  return (
    <div>
      {loading && <p>Loading cards...</p>}
      {error && <p>{error}</p>}
      {cards.length > 0 ? (
        <>
          <h1>Card Gallery</h1>
          <div className="card-gallery">
            {cards.map((card, index) => (
              <div key={index} className="card">
                <img src={card.url} alt={card.name} height={"300px"}/>
                <p>{card.name}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        !loading && <div>No cards available</div>
      )}
    </div>
  );
}
