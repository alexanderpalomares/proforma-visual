import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" })); // por si mandamos imágenes base64

// 🚀 Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

app.post("/api/pdf", async (req, res) => {
  const { html, filename = "documento.pdf" } = req.body;
  if (!html) {
    console.error("❌ No se recibió HTML en la petición");
    return res.status(400).json({ error: "Falta el HTML" });
  }

  let browser;
  try {
    console.log("📥 Recibida petición para generar PDF:", { filename, htmlLength: html.length });

    // 🔍 Bloque de diagnóstico
    try {
      console.log("📂 Puppeteer executable path:", puppeteer.executablePath());
    } catch (err) {
      console.error("❌ puppeteer.executablePath() falló:", err.message);
    }

    try {
      browser = await puppeteer.launch({
        headless: true, // 👈 obligatorio en Render
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
      });
      console.log("✅ Puppeteer logró lanzar Chromium");
    } catch (err) {
      console.error("❌ Puppeteer NO logró lanzar Chromium:", err.message);
      return res.status(500).json({ error: "Puppeteer no pudo lanzar Chromium", details: err.message });
    }

    const page = await browser.newPage();
    console.log("✅ Nueva página abierta");

    await page.setContent(html, { waitUntil: ["domcontentloaded", "networkidle0"] });
    console.log("✅ HTML cargado en Puppeteer");

    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    console.log("✅ Viewport configurado");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" }
    });
    console.log("✅ PDF generado, tamaño:", pdfBuffer.length);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error("🔥 Error generando PDF:", err.message);
    console.error("🔥 Stack completo:", err.stack);
    res.status(500).json({ error: "Error al generar el PDF", details: err.message });
  } finally {
    if (browser) {
      await browser.close();
      console.log("🔒 Navegador cerrado");
    }
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 PDF server listo en http://localhost:${PORT}`));
