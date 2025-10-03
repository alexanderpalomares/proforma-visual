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
 * ⚠️ Mantén estos strings tal cual; garantizan que Chromium headless renderice Poppins sin CORS ni filesystem.
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

    // 👇 Opcional: asegura estilos de pantalla; usa "print" si prefieres reglas @media print
    await page.emulateMediaType("screen");

    // Carga contenido y espera redes
    await page.setContent(processedHtml, { waitUntil: ["domcontentloaded", "networkidle0"] });

    // ⏳ Asegura que las fuentes WOFF2 embebidas se hayan cargado
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 PDF server listo en http://localhost:${PORT}`));
