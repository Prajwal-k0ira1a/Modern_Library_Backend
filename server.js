import {app} from "./app.js"
import dotenv from "dotenv"

dotenv.config();
const port = process.env.PORT;
app.get("/", (req, res) => {
    res.send("Welcome to the Library Backend");
});
app.listen(port,()=>{
    console.log("Server is running on ",`http://localhost:${port}`)
})