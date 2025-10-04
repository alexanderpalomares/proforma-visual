// server/index.js
import express from "express";
import cors from "cors";

let puppeteer;
let chromium;

// 📌 Detectamos el entorno: si NODE_ENV = production, usamos puppeteer-core + chromium
if (process.env.NODE_ENV === "production") {
  const puppeteerCoreModule = await import("puppeteer-core");
  const chromiumModule = await import("@sparticuz/chromium");
  puppeteer = puppeteerCoreModule.default;
  chromium = chromiumModule.default;
  console.log("🌐 Modo PRODUCCIÓN: usando puppeteer-core + @sparticuz/chromium");
} else {
  const puppeteerModule = await import("puppeteer");
  puppeteer = puppeteerModule.default;
  console.log("💻 Modo LOCAL: usando puppeteer estándar");
}

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

// 🚀 Health check
app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

/* 🧪 TEST: http://localhost:4000/api/debug-pdf */
app.get("/api/debug-pdf", async (req, res) => {
  try {
    const browser = await puppeteer.launch(
      process.env.NODE_ENV === "production"
        ? {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
          }
        : {
            headless: true, // Local usa Chromium descargado por puppeteer normal
          }
    );

    const page = await browser.newPage();
    await page.setContent("<h1>TEST DEBUG PDF ✅</h1><p>Backend funcionando.</p>");
    const buffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=debug.pdf",
      "Content-Length": buffer.length,
    });
    res.send(buffer);
  } catch (err) {
    console.error("❌ Error en /api/debug-pdf:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

/* 📝 Endpoint principal con logs de diagnóstico */
app.post("/api/pdf", async (req, res) => {
  try {
    const { html, filename = "documento.pdf" } = req.body;
    if (!html) {
      return res.status(400).json({ error: "Falta HTML" });
    }

    console.log("📥 HTML recibido. Longitud:", html.length);

    const browser = await puppeteer.launch(
      process.env.NODE_ENV === "production"
        ? {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
          }
        : {
            headless: true,
          }
    );

    const page = await browser.newPage();

    try {
      await page.setContent(html, { waitUntil: "networkidle0", timeout: 20000 });
      console.log("✅ HTML cargado correctamente en Puppeteer");
    } catch (err) {
      console.error("❌ Error en page.setContent:", err);
      await browser.close();
      return res.status(500).json({ error: "Error en setContent", details: err.message });
    }

    let pdfBuffer;
    try {
      pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      });
      console.log("✅ PDF generado. Tamaño:", pdfBuffer.length);
    } catch (err) {
      console.error("❌ Error en page.pdf:", err);
      await browser.close();
      return res.status(500).json({ error: "Error en generación de PDF", details: err.message });
    }

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ Error general en /api/pdf:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// 🟢 Render usa un puerto dinámico
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor PDF escuchando en http://localhost:${PORT}`);
});
