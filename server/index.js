import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" })); // por si mandamos imágenes base64

app.post("/api/pdf", async (req, res) => {
  const { html, filename = "documento.pdf" } = req.body;
  if (!html) return res.status(400).json({ error: "Falta el HTML" });

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    // Carga el HTML tal cual lo mandas desde React
    await page.setContent(html, { waitUntil: ["domcontentloaded", "networkidle0"] });

    // Mantén proporción de tu preview (≈ A4 a 96 dpi = 794px)
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,      // respeta colores/fondos
      preferCSSPageSize: true,    // respeta @page si lo defines
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF error:", err);
    res.status(500).json({ error: "Error al generar el PDF" });
  } finally {
    if (browser) await browser.close();
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`PDF server listo en http://localhost:${PORT}`));
