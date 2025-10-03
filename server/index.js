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
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// 🚀 Healthcheck
app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

// 📂 Ubicación de fuentes en Base64 (ajustada para server/ en raíz)
const FONTS_DIR = path.join(process.cwd(), "server", "fonts");

function readBase64File(name) {
  const filePath = path.join(FONTS_DIR, `${name}.b64.txt`);
  return fs.readFileSync(filePath, "utf8");
}

// 📌 Cargamos las fuentes Base64 en variables
const POPPINS_REGULAR_B64 = readBase64File("Poppins-Regular");
const POPPINS_SEMIBOLD_B64 = readBase64File("Poppins-SemiBold");
const POPPINS_BOLD_B64 = readBase64File("Poppins-Bold");
const POPPINS_EXTRABOLD_B64 = readBase64File("Poppins-ExtraBold");

// 🧠 CSS con las fuentes incrustadas en Base64 (MIME corregido)
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

// 🧠 Inyectar CSS en HTML entrante
function injectPoppinsFonts(html) {
  return html
    .replace(/<link[^>]+fonts\.googleapis[^>]*>/gi, "")
    .replace(/<head>/i, `<head>${POPPINS_BASE64_CSS}`);
}

// 📄 Generación de PDFs
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

    await page.setContent(processedHtml, { waitUntil: ["domcontentloaded", "networkidle0"] });
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const fontsReady = await page.evaluate(() => document.fonts.check('800 32px "Poppins"'));
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

// 🧪 Test de fuentes
app.get("/api/pdf/test", async (req, res) => {
  let browser;
  try {
    const testHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Test Poppins</title>
          ${POPPINS_BASE64_CSS}
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
          <p>Si este texto aparece en Poppins, las fuentes están embebidas correctamente ✅</p>
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
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

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

// 🚀 Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 PDF server listo en http://localhost:${PORT}`));
