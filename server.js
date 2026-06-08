import http from "node:http";
import { getDataFromDB } from "./database/db.js";
import { sendJSONResponse } from "./utils/utils.js";
import { filterDataByField } from "./utils/utils.js";
import { error } from "node:console";

const PORT = 8000;

const server = http.createServer(async (req, res) => {
    try {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const queryObj = Object.fromEntries(urlObj.searchParams)
        const destinationsData = await getDataFromDB();
        //All Routes
        if (req.url === "/") {
            sendJSONResponse(res, "application/json", 200, {
                success: true,
                message: "Welcome to the Home Page!",
                requested_url: req.url
            });
        } else if (urlObj.pathname === "/api" && req.method === "GET") {
            let filteredData = destinationsData;
            if (queryObj.continent) {
                filteredData = filterDataByField(filteredData, "continent", queryObj.continent)
            }
            if (queryObj.country) {
                filteredData = filterDataByField(filteredData, "country", queryObj.country)
            }
            if (queryObj.is_open_to_public) {
                const isPublic = queryObj.is_open_to_public === "true";
                filteredData = filteredData.filter(dest =>
                    dest.is_open_to_public === isPublic
                );
            }
            sendJSONResponse(res, "application/json", 200, {
                success: true,
                requested_method: req.method,
                urlObj_pathname: urlObj.pathname,
                requested_url: req.url,
                data: filteredData,
            });
        } else if (req.url.startsWith("/api/continent") && req.method === "GET") {
            const paramContinent = req.url.split("/").pop();
            const filteredData = filterDataByField(destinationsData, "continent", paramContinent);
            sendJSONResponse(res, "application/json", 200, {
                success: true,
                data: filteredData,
                requested_url: req.url,
                requested_method: req.method
            });
        } else if (req.url.startsWith("/api/country") && req.method === "GET") {
            const paramCountry = req.url.split("/").pop();
            const filteredData = filterDataByField(destinationsData, "country", paramCountry);
            sendJSONResponse(res, "application/json", 200, {
                success: true,
                data: filteredData,
                requested_url: req.url,
                requested_method: req.method
            });
        } else {
            sendJSONResponse(res, "application/json", 404, {
                success: false,
                error: "404 Not Found",
                message: "Page not found!",
                requested_url: req.url
            });
        }
    } catch (err) {
        console.log(err)
        sendJSONResponse(res, "application/json", 500, {
            success: false,
            error: "Internal Server Error",
            message: err.message,
        });
    }
});
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});