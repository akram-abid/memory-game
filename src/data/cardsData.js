export async function getCardData(cardsNumber) {
    let data = [];
    const response = await fetch(
        `https://radlands.fandom.com/api.php?action=query&format=json&list=allimages&origin=*&ailimit=${cardsNumber}`
    );
    data = await response.json();
    console.log("ooo, ", data);
    return data;
}

export function generateCards(count) {
    return Array.from({ length: count }, (_, i) => ({
        src: `https://picsum.photos/200/300?random=${Math.random()}`, // Use a unique random value for each card
        alt: `char${i + 1}`,
    }));
}
