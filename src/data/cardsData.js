export async function getCardData(count = 15) {
    try {
        const response = await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php");
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const monsters = data.data.filter(card => card.type.includes("Monster"));

            if (monsters.length < count) {
                throw new Error("Not enough monster cards available");
            }

            const shuffled = monsters.sort(() => 0.5 - Math.random()).slice(0, count);

            const retrivedData = shuffled.map((card, index) => ({
                id: card.id,
                index: index,
                name: card.name,
                url: card.card_images[0].image_url // Get the first image URL
            }));
            return retrivedData

        } else {
            throw new Error("No cards found");
        }
    } catch (error) {
        console.error("Error fetching monster cards:", error);
        return [];
    }
}