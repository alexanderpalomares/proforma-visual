import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// 🚀 Healthcheck
app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

/**
 * 🎨 Fuentes Poppins incrustadas en Base64 (.woff2)
 * 400 (Regular), 600 (SemiBold), 700 (Bold), 800 (ExtraBold)
 * ⚠️ Sustituye los comentarios /* ... */ por tus cadenas base64 reales si aún no lo hiciste.
 */
const POPPINS_CSS = `
<style>
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  src: url(data:font/woff2;base64,/* ... tu base64 400 ... */) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  src: url(data:font/woff2;base64,/* ... tu base64 600 ... */) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  src: url(data:font/woff2;base64,/* ... tu base64 700 ... */) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  src: url(data:font/woff2;base64,/* ... tu base64 800 ... */) format('woff2');
}

/* Forzamos Poppins por herencia */
html, body, * {
  font-family: 'Poppins', Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
`;

/** ✅ Inyecta Poppins en <head> y limpia Google Fonts si existiese */
function injectPoppinsFonts(html) {
  return html
    .replace(/<link[^>]+fonts\.googleapis[^>]*>/gi, "")
    .replace(/<head>/i, `<head>${POPPINS_CSS}`);
}

/**
 * 📄 Generación real de PDFs desde la app
 */
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
    await page.evaluateHandle("document.fonts.ready");

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

/**
 * 🧪 TEST: Endpoint de diagnóstico para aislar el problema de fuentes
 * Genera un PDF mínimo con Poppins embebido para verificar si Chromium + Render lo soportan realmente.
 */
app.get("/api/pdf/test", async (req, res) => {
  let browser;
  try {
    const testHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Test Poppins</title>
          ${POPPINS_CSS}
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
    await page.evaluateHandle("document.fonts.ready");

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 PDF server listo en http://localhost:${PORT}`));
