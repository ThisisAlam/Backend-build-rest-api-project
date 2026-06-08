export function sendJSONResponse(res, contentType, statusCode, JSONObject) {
    res.setHeader("Content-Type", contentType);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Method", "GET");
    res.statusCode = statusCode;
    res.end(JSON.stringify(JSONObject, null, 2));
}

export function filterDataByField(data, dataType, param){
    return data.filter(dest => {
        return dest[dataType].toLowerCase() === param.toLowerCase();
    });
} 

// res.setHeader("Content-Type", "application/json");
// res.statusCode = 200;
// res.end(JSON.stringify({
//     success: true,
//     data: destinationsData,
//     requested_url: req.url,
//     requested_method: req.method
// },null, 2));
// sendJSONResponse(res, "application/json", 200, true, destinationsData, req.url, req.method);
