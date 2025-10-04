// server/index.js
import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const app = express();

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
  allowedHeaders: ["Content-Type", "Accept"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} desde: ${req.headers.origin || "sin origin"}`);
  next();
});

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/", (req, res) => {
  res.json({ 
    status: "ok",
    message: "Servidor de generación de PDF activo 🚀",
    timestamp: new Date().toISOString(),
    version: "2.1"
  });
});

app.post("/api/pdf", async (req, res) => {
  let browser;
  const startTime = Date.now();
  
  try {
    const { html, filename = "documento.pdf" } = req.body;
    
    if (!html) {
      console.error("❌ Falta HTML");
      return res.status(400).json({ error: "Falta HTML en el body" });
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔧 INICIANDO GENERACIÓN DE PDF");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📄 HTML: ${html.length} caracteres`);
    console.log(`📎 Filename: ${filename}`);
    console.log(`⏰ Tiempo inicio: ${new Date().toISOString()}`);

    // Configurar Chromium para Render
    const chromiumConfig = {
      args: [
        ...chromium.args,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process',
        '--no-zygote'
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    };

    console.log("🚀 Lanzando navegador...");
    browser = await puppeteer.launch(chromiumConfig);
    console.log("✅ Navegador lanzado");

    const page = await browser.newPage();
    
    await page.setViewport({ 
      width: 1200, 
      height: 1600,
      deviceScaleFactor: 1
    });
    console.log("✅ Viewport configurado");

    console.log("📝 Cargando HTML...");
    await page.setContent(html, { 
      waitUntil: "load",
      timeout: 30000 
    });
    console.log("✅ HTML cargado");

    // ✅ USAR setTimeout EN LUGAR DE page.waitForTimeout
    console.log("⏳ Esperando renderizado...");
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("✅ Renderizado completado");

    console.log("🖨️ Generando PDF...");
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      margin: { 
        top: "20px", 
        right: "20px", 
        bottom: "20px", 
        left: "20px" 
      },
      displayHeaderFooter: false,
    });

    const duration = Date.now() - startTime;
    console.log(`✅ PDF generado en ${duration}ms`);
    console.log(`📦 Tamaño: ${pdfBuffer.length} bytes`);

    // Validaciones
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("PDF generado está vacío");
    }

    const pdfHeader = pdfBuffer.slice(0, 5).toString('utf8');
    console.log(`🔍 Header PDF: "${pdfHeader}"`);
    
    if (!pdfHeader.startsWith('%PDF')) {
      console.error("❌ Buffer NO es PDF válido");
      console.error("Primeros 20 bytes:", pdfBuffer.slice(0, 20).toString('utf8'));
      throw new Error("El buffer generado no es un PDF válido");
    }

    console.log("✅ PDF válido (header correcto)");

    // Headers de respuesta
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    console.log("📤 Enviando PDF al cliente...");
    res.send(pdfBuffer);
    console.log("✅ PDF enviado exitosamente");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (err) {
    const duration = Date.now() - startTime;
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error(`❌ ERROR después de ${duration}ms`);
    console.error("Mensaje:", err.message);
    console.error("Stack:", err.stack);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: "Error al generar PDF", 
        details: err.message,
        timestamp: new Date().toISOString()
      });
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
        console.log("🔒 Navegador cerrado");
      } catch (closeErr) {
        console.error("⚠️ Error al cerrar navegador:", closeErr);
      }
    }
  }
});

app.use((err, req, res, next) => {
  console.error("🚨 Error global:", err);
  if (!res.headersSent) {
    res.status(500).json({ 
      error: "Error interno del servidor",
      message: err.message 
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🚀 SERVIDOR PDF INICIADO`);
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ ${new Date().toISOString()}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando...');
  process.exit(0);
});