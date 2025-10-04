// server/index.js
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const app = express();

/* 🌐 Configuración CORS flexible */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = ["https://rapiproforma.vercel.app"];
    const localhostRegex = /^http:\/\/localhost:\d+$/;
    if (allowedOrigins.includes(origin) || localhostRegex.test(origin)) {
      callback(null, true);
    } else {
      console.warn("❌ CORS bloqueado para origin:", origin);
      callback(new Error("CORS no permitido"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log("🌐 Petición desde origin:", req.headers.origin);
  next();
});

app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

app.post("/api/pdf", async (req, res) => {
  try {
    const { html, filename = "documento.pdf" } = req.body;
    if (!html) return res.status(400).json({ error: "Falta HTML" });

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    console.log("📐 Tamaño del PDF generado:", pdfBuffer.length, "bytes");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ Error al generar PDF:", err);
    res.status(500).json({ error: "Error al generar PDF" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor PDF escuchando en http://localhost:${PORT}`);
});
