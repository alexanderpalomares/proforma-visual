// server/index.js
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const app = express();

/* 🌐 Configuración CORS flexible:
   - Permite cualquier localhost (cualquier puerto) para desarrollo con Vite
   - Permite tu dominio de producción en Vercel
   - Maneja preflight (OPTIONS) correctamente
*/
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Permite peticiones sin Origin (Postman, SSR, etc.)

    const allowedOrigins = ["https://rapiproforma.vercel.app"];
    const localhostRegex = /^http:\/\/localhost:\d+$/; // ✅ Acepta cualquier puerto local dinámico

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

// ✅ Habilitar CORS globalmente
app.use(cors(corsOptions));
// ✅ Manejar preflight OPTIONS correctamente
app.options("*", cors(corsOptions));

// 📝 Log de origen para debug
app.use((req, res, next) => {
  console.log("🌐 Petición desde origin:", req.headers.origin);
  next();
});

// 🧠 Permitir enviar HTML grande para PDF
app.use(express.json({ limit: "20mb" }));

// 🚀 Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

// 📝 Endpoint principal para generar PDF
app.post("/api/pdf", async (req, res) => {
  try {
    const { html, filename = "documento.pdf" } = req.body;
    if (!html) {
      return res.status(400).json({ error: "Falta HTML" });
    }

    // 🧭 Lanzar navegador Puppeteer compatible con Render
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

    // 📎 Devolver PDF con headers adecuados
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

// 🟢 Render usa un puerto dinámico
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor PDF escuchando en http://localhost:${PORT}`);
});