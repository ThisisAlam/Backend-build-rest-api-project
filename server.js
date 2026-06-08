import http from "node:http";
import { getDataFromDB } from "./database/db.js";
// import { error } from "node:console";

const PORT = 8000;
const server = http.createServer(async (req, res) => {
    const destinationsData = await getDataFromDB();
    if (req.url === "/") {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify({
            success: true,
            message: "Welcome to the Home Page!",
            requested_url: req.url
        },null, 2));
    } else if (req.url === "/api" && req.method === "GET") {
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify({
            success: true,
            data: destinationsData,
            requested_url: req.url,
            requested_method: req.method  
        },null, 2));
    } else if (req.url.startsWith("/api/continent/") && req.method === "GET") {
        const continent = req.url.split("/").pop();
        const filteredData = destinationsData.filter(dest => {
            return dest.continent.toLowerCase() === continent.toLowerCase();
        });
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 200;
        res.end(JSON.stringify({
            success: true,
            data: filteredData,
            requested_url: req.url,
            requested_method: req.method  
        },null, 2));
    } else {
        res.writeHead(404, {
            "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
            success: false,
            error: "404 Not Found", 
            message: "Page not found!",
            requested_url: req.url
        },null, 2));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});