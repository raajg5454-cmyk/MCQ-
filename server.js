// Chalane ke liye: ANTHROPIC_API_KEY=sk-ant-... node server.js  (Node 18+)
const http = require("http"), fs = require("fs"), path = require("path");
const KEY = process.env.ANTHROPIC_API_KEY, PORT = process.env.PORT || 3000;
const MODEL = process.env.MODEL || "claude-sonnet-5-5";
const PROMPT = "Photos me MCQ sawal hain. Har sawal alag nikalo. Question aur sabhi visible options photo se jaise likhe hain bilkul waise copy karo; apne naye options mat banao. Agar photo me sahi answer marked hai to wahi lo, warna khud sahi option chuno. 1-2 line ka chhota explanation likho (sawal ki bhasha me). Agar photo dhundhli ho ya answer pakka na ho to unsure=true karo. Sirf valid JSON do, koi markdown nahi: {\"questions\":[{\"q\":\"...\",\"options\":[\"...\",\"...\",\"...\",\"...\"],\"answer\":0,\"explanation\":\"...\",\"unsure\":false}]}. answer 0-based index hai. Options me A) B) labels mat rakho.";
const FILES = {"/": ["index.html","text/html"], "/index.html": ["index.html","text/html"], "/style.css": ["style.css","text/css"], "/app.js": ["app.js","text/javascript"]};
function send(res, code, obj) { res.writeHead(code, {"Content-Type": "application/json"}); res.end(JSON.stringify(obj)); }
http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api/extract") {
    if (!KEY) return send(res, 500, {error: "Server par ANTHROPIC_API_KEY set nahi hai."});
    let body = "";
    req.on("data", c => { body += c; if (body.length > 30e6) req.destroy(); });
    req.on("end", async () => {
      try {
        const {images} = JSON.parse(body);
        if (!Array.isArray(images) || !images.length || images.length > 6) return send(res, 400, {error: "1 se 6 photo bhejo."});
        const content = images.map(d => ({type: "image", source: {type: "base64", media_type: "image/jpeg", data: d}}));
        content.push({type: "text", text: PROMPT});
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {"content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01"},
          body: JSON.stringify({model: MODEL, max_tokens: 4000, messages: [{role: "user", content}]})
        });
        const j = await r.json();
        if (!r.ok) return send(res, 502, {error: "AI error: " + ((j.error && j.error.message) || r.status)});
        const text = (j.content || []).map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
        send(res, 200, JSON.parse(text));
      } catch (e) { send(res, 500, {error: "Processing error: " + e.message}); }
    });
    return;
  }
  const f = FILES[req.url.split("?")[0]];
  if (!f) { res.writeHead(404); return res.end("Not found"); }
  res.writeHead(200, {"Content-Type": f[1] + "; charset=utf-8"});
  fs.createReadStream(path.join(__dirname, f[0])).pipe(res);
}).listen(PORT, () => console.log("Chal raha hai: http://localhost:" + PORT));
