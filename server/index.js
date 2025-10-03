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

// 📝 (Opcional) Log para verificar el origin de cada request
app.use((req, res, next) => {
  console.log("🌐 Petición desde origin:", req.headers.origin);
  next();
});

app.use(express.json({ limit: "20mb" }));

// 🚀 Healthcheck
app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

// 📂 Ubicación de fuentes en Base64
const FONTS_DIR = path.join(process.cwd(), "server", "fonts");

function readBase64File(name) {
  try {
    const filePath = path.join(FONTS_DIR, `${name}.b64.txt`);
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    console.error(`⚠️ No se pudo leer la fuente ${name}:`, e.message);
    return "";
  }
}

// 📌 Cargamos las fuentes Base64 en variables
const POPPINS_REGULAR_B64 = readBase64File("Poppins-Regular");
const POPPINS_SEMIBOLD_B64 = readBase64File("Poppins-SemiBold");
const POPPINS_BOLD_B64 = readBase64File("Poppins-Bold");
const POPPINS_EXTRABOLD_B64 = readBase64File("Poppins-ExtraBold");

// 🧠 CSS con las fuentes incrustadas en Base64
const POPPINS_BASE64_CSS = `
<style>
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  src: url(data:application/x-font-ttf;charset=utf-8;base64,${POPPINS_REGULAR_B64}) format('truetype');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  src: url(data:application/x-font-ttf;charset=utf-8;base64,${POPPINS_SEMIBOLD_B64}) format('truetype');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  src: url(data:application/x-font-ttf;charset=utf-8;base64,${POPPINS_BOLD_B64}) format('truetype');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  src: url(data:application/x-font-ttf;charset=utf-8;base64,${POPPINS_EXTRABOLD_B64}) format('truetype');
}

html, body, * {
  font-family: 'Poppins', Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
`;

// ✨ Inyectar fuentes en el HTML entrante
function injectPoppinsFonts(html) {
  return html
    .replace(/<link[^>]+fonts\.googleapis[^>]*>/gi, "")
    .replace(/<head>/i, `<head>${POPPINS_BASE64_CSS}`);
}

// 📄 Endpoint principal de generación de PDF
app.post("/api/pdf", async (req, res) => {
  const { html, filename = "proforma.pdf" } = req.body;
  if (!html) return res.status(400).json({ error: "Falta el HTML" });

  let browser;
  try {
    const processedHtml = injectPoppinsFonts(html);

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.setContent(processedHtml, { waitUntil: ["domcontentloaded", "networkidle0"] });
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
