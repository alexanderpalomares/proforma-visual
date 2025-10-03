import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import path from "path";
import { pathToFileURL } from "url";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// 🚀 Healthcheck
app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

//
// 🧠 1. Detectar carpeta de fuentes
//
const ROOT = process.cwd(); // Ej: /opt/render/project/src
const CANDIDATE_A = path.join(ROOT, "server", "public", "fonts");
const CANDIDATE_B = path.join(ROOT, "public", "fonts");
const FONTS_DIR = fs.existsSync(CANDIDATE_A) ? CANDIDATE_A : CANDIDATE_B;

if (!fs.existsSync(FONTS_DIR)) {
  console.warn("⚠️ No se encontró carpeta de fuentes en:", FONTS_DIR);
} else {
  console.log("📂 Usando carpeta de fuentes:", FONTS_DIR);
}

const furl = (filename) => {
  const fullPath = path.join(FONTS_DIR, filename);
  const url = pathToFileURL(fullPath).href;
  console.log(`📝 Fuente detectada: ${filename} -> ${url}`);
  return url;
};

//
// 🧠 2. CSS con rutas absolutas file://
//
const POPPINS_FILE_CSS = `
<style>
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  src: url('${furl("Poppins-Regular.ttf")}') format('truetype');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  src: url('${furl("Poppins-SemiBold.ttf")}') format('truetype');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  src: url('${furl("Poppins-Bold.ttf")}') format('truetype');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  src: url('${furl("Poppins-ExtraBold.ttf")}') format('truetype');
}

html, body, * {
  font-family: 'Poppins', Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
`;

//
// 🧠 3. Inyección CSS en HTML entrante
//
function injectPoppinsFonts(html) {
  return html
    .replace(/<link[^>]+fonts\.googleapis[^>]*>/gi, "")
    .replace(/<head>/i, `<head>${POPPINS_FILE_CSS}`);
}

//
// 📄 4. Generación de PDFs
//
app.post("/api/pdf", async (req, res) => {
  const { html, filename = "documento.pdf" } = req.body;
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
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

    await page.emulateMediaType("screen");
    await page.setContent(processedHtml, { waitUntil: ["domcontentloaded", "networkidle0"] });

    const fontsReady = await page.evaluate(() => {
      return document.fonts.check('800 32px "Poppins"');
    });
    console.log("✅ ¿Poppins cargó en proforma? =>", fontsReady);

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

//
// 🧪 5. Test de diagnóstico
//
app.get("/api/pdf/test", async (req, res) => {
  let browser;
  try {
    const testHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Test Poppins</title>
          ${POPPINS_FILE_CSS}
          <style>
            body {
              font-family: 'Poppins', sans-serif;
              padding: 40px;
            }
            h1 {
              font-size: 32px;
              font-weight: 800;
              color: #222;
            }
            p {
              font-size: 16px;
              font-weight: 400;
            }
          </style>
        </head>
        <body>
          <h1>Hola con Poppins 800</h1>
          <p>Si este texto aparece en Poppins, las fuentes están bien integradas ✅</p>
        </body>
      </html>
    `;

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
    await page.setContent(testHtml, { waitUntil: ["domcontentloaded", "networkidle0"] });

    const ok = await page.evaluate(() => document.fonts.check('800 32px "Poppins"'));
    console.log("✅ ¿Poppins cargó en test? =>", ok);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="test-poppins.pdf"`);
    res.end(pdfBuffer);
  } catch (err) {
    console.error("🔥 Error en /api/pdf/test:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
});

//
// 🚀 Start server
//
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 PDF server listo en http://localhost:${PORT}`));
