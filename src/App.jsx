import { useState, useEffect } from 'react';
import { getCardData } from './data/cardsData';
import './App.css';

export default function App() {
  const [cards, setCards] = useState([]);
  return (
    <>
      <CardGallery numberOfCards={12} setCards={setCards}/>
    </>
  );
}

function CardGallery({ numberOfCards , setCards}) {

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const result = await getCardData(numberOfCards);
        setCards(result);
        console.log("Fetched Cards:", result); // Log the result here
      } catch (err) {
        throw new Error("no cards to retrive something went wrong")
      }
    };

    fetchCards();
    
  }, [numberOfCards, setCards]);
}
