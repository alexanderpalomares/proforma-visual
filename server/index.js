// server/index.js
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🌐 CORS
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const allowedOrigins = [
        /^http:\/\/localhost:\d+$/,
        /^https:\/\/.*\.vercel\.app$/,
        "https://rapiproforma.vercel.app",
      ];
      const isAllowed = allowedOrigins.some((rule) =>
        typeof rule === "string" ? rule === origin : rule.test(origin)
      );
      return isAllowed ? cb(null, true) : cb(new Error("CORS bloqueado: " + origin));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("🚀 Servidor de PDF activo y optimizado");
});

// 🧠 Instancia única de Puppeteer (reutilizable)
let browserPromise = null;
async function getBrowser() {
  if (!browserPromise) {
    console.time("⏱ Puppeteer launch");
    browserPromise = puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: { width: 1080, height: 1920 },
    });
    await browserPromise;
    console.timeEnd("⏱ Puppeteer launch");
  }
  return browserPromise;
}

// 🧾 Endpoint de PDF
app.post("/api/pdf", async (req, res) => {
  const t0 = performance.now();

  try {
    const { html, filename = "documento.pdf" } = req.body;
    if (!html) return res.status(400).json({ error: "Falta el HTML" });

    const browser = await getBrowser();
    const page = await browser.newPage();

    console.time("⏱ setContent");
    await page.setContent(html, { waitUntil: "networkidle0" });
    console.timeEnd("⏱ setContent");

    console.time("⏱ pdf");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });
    console.timeEnd("⏱ pdf");

    await page.close();

    const t1 = performance.now();
    console.log(`✅ PDF generado en ${(t1 - t0).toFixed(2)} ms`);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("❌ Error generando PDF:", error);
    res.status(500).json({ error: "Error generando PDF" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor PDF escuchando en http://localhost:${PORT}`);
});
