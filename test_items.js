const { default: axios } = require("axios");
axios.get("http://localhost:3000/api/items/todos?page=1&pageSize=5&nombre=limon").then(res => console.log(Object.keys(res.data), res.data.items[0])).catch(err => console.log(err.message));
