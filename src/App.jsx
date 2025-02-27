import { useState, useEffect } from 'react'
import { generateCards, getCardData } from './data/cardsData'
import './App.css'

function App() {
  return (
    <>
    <CardGallery />
    </>
  )
  
}

function CardGallery() {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const numberOfCards = 20; // Adjust as needed
    
    const fetchCards = async () => {
      try {
        setLoading(true);
        const result = await getCardData(numberOfCards);
        console.log("API Response:", result); // Log the full response
        setCardData(result);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching card data:", err);
        setError("Failed to load cards");
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) return <div>Loading cards data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cardData) return <div>No data available</div>;

  // Extract the actual data structure
  const images = cardData.query?.allimages || [];
  console.log("hi there ", images);
  
  return (
    <div>
      {images.length > 0 ? (
        <>
        <h1>hi</h1>
        <img 
          src={images[4]?.url} 
          alt="awedi" 
        />
</>
      ) : (
        <div>No images available</div>
      )}
    </div>
  );
};

function Display(){
  let fdata
  const data = generateCards(13)
  console.log("hi thre",data) 
  return (
    <img src={data[4].src} alt="" />
  )
}

export default App
