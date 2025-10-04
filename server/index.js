// server/index.js
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import path from "path";
import { fileURLToPath } from "url";

// 🧭 Necesario para rutas absolutas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🌐 CORS: permite Vercel y localhost
app.use(
  cors({
    origin: (origin, cb) => {
      // Permitir sin origin (por ejemplo, Postman)
      if (!origin) return cb(null, true);

      const allowedOrigins = [
        /^http:\/\/localhost:\d+$/,           // desarrollo local
        /^https:\/\/.*\.vercel\.app$/,        // previews de Vercel
        "https://rapiproforma.vercel.app"     // dominio de producción (ajústalo si usas otro)
      ];

      const isAllowed = allowedOrigins.some(rule =>
        typeof rule === "string" ? rule === origin : rule.test(origin)
      );

      return isAllowed ? cb(null, true) : cb(new Error("CORS bloqueado: " + origin));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

app.use(express.json({ limit: "20mb" }));

// 📂 Servir archivos estáticos opcionalmente (ej: fuentes)
app.use(express.static(path.join(__dirname, "public")));

// 🟢 Endpoint de salud
app.get("/", (req, res) => {
  res.send("Servidor de PDF activo 🚀");
});

// 🧾 Endpoint principal para generar PDFs
app.post("/api/pdf", async (req, res) => {
  try {
    const { html, filename = "documento.pdf" } = req.body;

    if (!html) {
      return res.status(400).json({ error: "Falta el HTML" });
    }

    // 🧠 Lanzar Chromium en Render
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      defaultViewport: { width: 1080, height: 1920 }
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // 📝 Generar el PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" }
    });

    await browser.close();

    // 📤 Enviar PDF como archivo descargable
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("❌ Error generando PDF:", error);
    res.status(500).json({ error: "Error generando PDF" });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor PDF escuchando en http://localhost:${PORT}`);
});
