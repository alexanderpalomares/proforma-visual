// index.js
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS configurado correctamente para Vercel y desarrollo local
app.use(
  cors({
    origin: ["https://rapiproforma.vercel.app", "http://localhost:5173"],
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);

// 📝 Log para verificar el origin de cada request
app.use((req, res, next) => {
  console.log("🌐 Petición desde origin:", req.headers.origin);
  next();
});

app.use(express.json({ limit: "20mb" }));

// ✅ Sirve la carpeta public (para fuentes .ttf y assets)
app.use(express.static(path.join(__dirname, "../public")));

// 🚀 Healthcheck
app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

// 📄 Endpoint principal de generación de PDF
app.post("/api/pdf", async (req, res) => {
  const { html, filename = "proforma.pdf" } = req.body;
  if (!html) return res.status(400).json({ error: "Falta el HTML" });

  let browser;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // 👇 Esta línea es CLAVE para que Puppeteer resuelva /fonts/ correctamente
    await page.setContent(html, {
      waitUntil: ["domcontentloaded", "networkidle0"],
      baseURL: process.env.RENDER_EXTERNAL_URL || "http://localhost:4000",
    });

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.end(pdfBuffer);
  } catch (err) {
    console.error("🔥 Error generando PDF:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 PDF server listo en http://localhost:${PORT}`));
