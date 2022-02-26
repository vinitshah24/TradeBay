const { DateTime } = require("luxon");
const { v4: uuidv4 } = require("uuid");

const trades = [
    {
        id: "1",
        name: "Caterpie",
        category: "Pokémon",
        description: "Caterpie is a Pokémon that resembles a green caterpillar with a yellow underside and teardrop-shaped tail.",
        status: "Sold",
        power: 50,
        condition: "New",
        image: "caterpie.jpg"
    },
    {
        id: "2",
        name: "Vulpix",
        category: "Pokémon",
        description: "Vulpix is a Fire type Pokémon introduced in Generation 1 . It is known as the Fox Pokémon",
        status: "Sold",
        power: 110,
        condition: "Used",
        image: "vulpix.jpg"
    },
    {
        id: "3",
        name: "Totodile",
        category: "Pokémon",
        description: "Totodile is a Water type Pokémon introduced in Generation 2. It is known as the Big Jaw Pokémon.",
        status: "Available",
        power: 70,
        condition: "New",
        image: "totodile.jpg"
    },
    {
        id: "4",
        name: "Son Goku",
        category: "Dragon Ball Z",
        description: "Goku is a Saiyan from Planet Vegeta. Three years after his birth, his parents sent him away from Planet Vegeta to Planet Earth due to his father's suspicion of Freeza the Evil Emperor.",
        status: "Available",
        power: 350,
        condition: "Used",
        image: "son_goku.png"
    },
    {
        id: "5",
        name: "Vegeta, Harnessed Power",
        category: "Dragon Ball Z",
        description: "Vegeta is the prince of an extraterrestrial warrior race known as the Saiyans. He is extremely arrogant, proud and hardworking; constantly referring to his heritage and royal status throughout the series.",
        status: "Sold",
        power: 500,
        condition: "New",
        image: "vegeta.png"
    },
    {
        id: "6",
        name: "Zamasu, Self-Supported",
        category: "Dragon Ball Z",
        description: "Zamasu is a Potara fusion born of the union between Goku Black (the original present Zamasu in the original present Goku's body) and Future Zamasu. He is the final antagonist of the Future Trunks Saga.",
        status: "Available",
        power: 120,
        condition: "Used",
        image: "zamasu.png"
    }
]

exports.find = () => {
    output = {}
    uniqueCategories = []
    for (var i = 0; i < trades.length; i++) {
        if (uniqueCategories.includes(trades[i].category) === false) {
            uniqueCategories.push(trades[i].category)
        }
    }
    output.categories = uniqueCategories
    output.items = trades
    return output
};
exports.findById = (id) => trades.find(trade => trade.id === id);
exports.save = (trade) => {
    // console.log("TRADE SAVE: " + trade)
    trade.id = uuidv4();
    trades.push(trade);
};

exports.updateById = (id, updatedTrade) => {
    let trade = trades.find(trade => trade.id === id);
    // console.log(updatedTrade.image)
    if (trade) {
        if (trade.name !== updatedTrade.name) trade.name = updatedTrade.name;
        if (trade.category !== updatedTrade.category) trade.category = updatedTrade.category;
        if (trade.description !== updatedTrade.description) trade.description = updatedTrade.description;
        if (trade.status !== updatedTrade.status) trade.status = updatedTrade.status;
        if (trade.power !== updatedTrade.power) trade.power = updatedTrade.power;
        if (trade.condition !== updatedTrade.condition) trade.condition = updatedTrade.condition;
        if (updatedTrade.image !== undefined) trade.image = updatedTrade.image;
        // console.log(trade);
        // console.log(trades);
        return true;
    } else {
        return false;
    }
};

exports.deleteById = (id) => {
    let index = trades.findIndex(trade => trade.id === id);
    if (index !== -1) {
        trades.splice(index, 1);
        return true;
    } else {
        return false;
    }
}