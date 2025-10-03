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
 * ⚠️ Aquí debes usar tus strings base64 reales de Poppins (400, 600, 700, 800)
 */
const POPPINS_CSS = `
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  src: url(data:font/woff2;base64,/* ... base64 400 ... */) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  src: url(data:font/woff2;base64,/* ... base64 600 ... */) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  src: url(data:font/woff2;base64,/* ... base64 700 ... */) format('woff2');
}
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  src: url(data:font/woff2;base64,/* ... base64 800 ... */) format('woff2');
}

html, body, * {
  font-family: 'Poppins', Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;

/** ✅ Inyecta Poppins en <head> y limpia Google Fonts */
function injectPoppinsFonts(html) {
  return html
    .replace(/<link[^>]+fonts\.googleapis[^>]*>/gi, "")
    .replace(/<head>/i, `<head><style>${POPPINS_CSS}</style>`);
}

// 🧪 TEST ENDPOINT para diagnosticar fuentes
app.get("/api/pdf/test", async (req, res) => {
  let browser;
  try {
    const testHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8"/>
          <title>Test Poppins</title>
          <style>${POPPINS_CSS}</style>
          <style>
            body { padding: 40px; }
            h1 { font-family: 'Poppins', sans-serif; font-weight: 800; font-size: 32px; }
            p { font-family: 'Poppins', sans-serif; font-weight: 400; font-size: 16px; }
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

    // 👇 Inyección forzada en runtime (diagnóstico)
    await page.addStyleTag({ content: POPPINS_CSS });

    // 👇 Verificación desde dentro de Chromium
    const fontCheck = await page.evaluate(() => document.fonts.check('800 32px "Poppins"'));
    console.log("✅ Verificación forzada de Poppins en runtime =>", fontCheck);

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

// 📄 Generación real de PDFs desde la app
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

    // 👇 Forzar inyección de fuentes en runtime
    await page.addStyleTag({ content: POPPINS_CSS });

    // 👇 Verificar en logs si la fuente se cargó realmente
    const fontCheck = await page.evaluate(() => document.fonts.check('800 28px "Poppins"'));
    console.log("¿Poppins cargó en proforma? =>", fontCheck);

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 PDF server listo en http://localhost:${PORT}`));
