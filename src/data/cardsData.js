export async function getCardData(count = 30) {
    try {
        const response = await fetch(
            "https://db.ygoprodeck.com/api/v7/cardinfo.php"
        );
        const data = await response.json();

        if (data.data && data.data.length > 0) {
            const shuffled = data.data
                .sort(() => 0.5 - Math.random())
                .slice(0, count);

            // Extract only name, id, and image URL
            return shuffled.map((card) => ({
                id: card.id,
                name: card.name,
                image_url: card.card_images?.[0]?.image_url || "",
            }));
        } else {
            throw new Error("No cards found");
        }
    } catch (error) {
        console.error("Error fetching Yu-Gi-Oh! cards:", error);
        return [];
    }
}
