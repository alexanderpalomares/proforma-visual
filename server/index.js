import express from "express";
import cors from "cors";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const app = express();
app.use(cors());
app.use(express.json({ limit: "20mb" }));

// 🚀 Endpoint de prueba
app.get("/", (req, res) => {
  res.send("Servidor de generación de PDF activo 🚀");
});

/**
 * 🧠 CSS con fuentes Poppins embebidas en Base64 (400, 600, 700, 800)
 * Esto evita depender de Google Fonts en Render / Puppeteer headless.
 * Los .woff2 fueron convertidos a base64 previamente.
 */
const POPPINS_CSS = `
<style>
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  src: url(data:font/woff2;base64,d09GMgABAAAAACWwABIAAAABuCAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABqAAAABwAAAAcbGf0b2FCAACwAAAAFgAAABYAAAABY21hcAAAsAAAAA4AAAAOAA8ABGN2dCAAALEAAAAiAAAAIgP3AjRmcGdtAAABCAAAAFsAAABbZ4AQX2dhc3AAAGgAAAAIAAAACAAAABBnbHlmAAAU3AAAZ5kAAOqeSMM4cmhlYWQAAEBAAAAANgAAADYFFV7kaGhlYQAAQEgAAAAgAAAAJAzBBG9obXR4AABBGAAAAQAAAAD4mWAAnmxvY2EAAEkUAAAAeAAAANgUVCFqbWF4cAAAS9gAAAAgAAAAIAHvAJdubmFtZQAATBgAAAE5AAAB9FGyjs1wb3N0AABNiAAAAHoAAACC40f/13ByZXAAAUcEAAAAnQAAAMGg7x+LeJxjYGRgYOBikGPQYWB0cfMJYeBgYGGAAJAMY05meiJQDMoDyrGAaQ4gZoOIAgCKIwNPAHicY2BkYWCcwMDKwMHUyXSGgYGhH0IzvmYwYuRgYGBiYGVmwAoC0lxTGBwYGJgBpR5BjP8H8jlAYQFZGA1GTAwAMusG9wB4nGNgZGBg4GIwYLBjYHJx8wlh4GBgYYAAkAxlDkB0lmY8BgABRRgBYnYGAAcYwAHAAAAAAAAAf//AAJ4nHWQy0oDMRBEb8PhUSoUxO+DQXwo8Qimth1V5HMBa2KnuhMuRzGJmV+bNo9N/rZ6x7FCKW3R3M1F/NRIRhV0pPdvXseMo4tzKq5rWBeeUXcfYUE6+jMsV1Yv81twgm8hx/9cI5jiB2b9DoekXeFluh9jsfkv2bsHV7lXW+MZ+4J3G5gB4nGNgQAYAAA4ABw==) format('woff2');
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  src: url(data:font/woff2;base64,d09GMgABAAAAACbcABIAAAAB6AgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABqAAAABwAAAAcbGf0b2FCAACwAAAAFgAAABYAAAABY21hcAAAsAAAAA4AAAAOAA8ABGN2dCAAALEAAAAiAAAAIgP3AjRmcGdtAAABCAAAAFsAAABbZ4AQX2dhc3AAAGgAAAAIAAAACAAAABBnbHlmAAAV4AAAb2AAAO2CvDJwrGhlYWQAAEDwAAAANgAAADYFFV7kaGhlYQAAQRAAAAAgAAAAJAzBBG9obXR4AABBGAAAAQAAAAD4mWAAnmxvY2EAAEk4AAAAeAAAANgUVCFqbWF4cAAAS9gAAAAgAAAAIAHvAJdubmFtZQAATCAAAAE7AAAB+FG2mylwb3N0AABNiAAAAHoAAACC40f/13ByZXAAAUcEAAAAnQAAAMGg7x+LeJxjYGRgYOBikGPQYWB0cfMJYeBgYGGAAJAMY05meiJQDMoDyrGAaQ4gZoOIAgCKIwNPAHicY2BkYWCcwMDKwMHUyXSGgYGhH0IzvmYwYuRgYGBiYGVmwAoC0lxTGBwYGJgBpR5BjP8H8jlAYQFZGA1GTAwAMusG9wB4nGNgZGBg4GIwYLBjYHJx8wlh4GBgYYAAkAxlDkB0lmY8BgABRRgBYnYGAAcYwAHAAAAAAAAAf//AAJ4nHWQy0oDMRBEb8PhUSoUxO+DQXwo8Qimth1V5HMBa2KnuhMuRzGJmV+bNo9N/rZ6x7FCKW3R3M1F/NRIRhV0pPdvXseMo4tzKq5rWBeeUXcfYUE6+jMsV1Yv81twgm8hx/9cI5jiB2b9DoekXeFluh9jsfkv2bsHV7lXW+MZ+4J3G5gB4nGNgQAYAAA4ABw==) format('woff2');
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  src: url(data:font/woff2;base64,d09GMgABAAAAACcEABIAAAAB9AgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABqAAAABwAAAAcbGf0b2FCAACwAAAAFgAAABYAAAABY21hcAAAsAAAAA4AAAAOAA8ABGN2dCAAALEAAAAiAAAAIgP3AjRmcGdtAAABCAAAAFsAAABbZ4AQX2dhc3AAAGgAAAAIAAAACAAAABBnbHlmAAAWVAAAcpoAAOEivL3hN2hlYWQAAED4AAAANgAAADYFFV7kaGhlYQAAQRAAAAAgAAAAJAzBBG9obXR4AABBGAAAAQAAAAD4mWAAnmxvY2EAAEk4AAAAeAAAANgUVCFqbWF4cAAAS9gAAAAgAAAAIAHvAJdubmFtZQAATCAAAAE7AAAB+FG2mylwb3N0AABNiAAAAHoAAACC40f/13ByZXAAAUcEAAAAnQAAAMGg7x+LeJxjYGRgYOBikGPQYWB0cfMJYeBgYGGAAJAMY05meiJQDMoDyrGAaQ4gZoOIAgCKIwNPAHicY2BkYWCcwMDKwMHUyXSGgYGhH0IzvmYwYuRgYGBiYGVmwAoC0lxTGBwYGJgBpR5BjP8H8jlAYQFZGA1GTAwAMusG9wB4nGNgZGBg4GIwYLBjYHJx8wlh4GBgYYAAkAxlDkB0lmY8BgABRRgBYnYGAAcYwAHAAAAAAAAAf//AAJ4nHWQy0oDMRBEb8PhUSoUxO+DQXwo8Qimth1V5HMBa2KnuhMuRzGJmV+bNo9N/rZ6x7FCKW3R3M1F/NRIRhV0pPdvXseMo4tzKq5rWBeeUXcfYUE6+jMsV1Yv81twgm8hx/9cI5jiB2b9DoekXeFluh9jsfkv2bsHV7lXW+MZ+4J3G5gB4nGNgQAYAAA4ABw==) format('woff2');
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 800;
  src: url(data:font/woff2;base64,d09GMgABAAAAACcEABIAAAAB+AgAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAABqAAAABwAAAAcbGf0b2FCAACwAAAAFgAAABYAAAABY21hcAAAsAAAAA4AAAAOAA8ABGN2dCAAALEAAAAiAAAAIgP3AjRmcGdtAAABCAAAAFsAAABbZ4AQX2dhc3AAAGgAAAAIAAAACAAAABBnbHlmAAAWVAAAcpoAAOEivL3hN2hlYWQAAED4AAAANgAAADYFFV7kaGhlYQAAQRAAAAAgAAAAJAzBBG9obXR4AABBGAAAAQAAAAD4mWAAnmxvY2EAAEk4AAAAeAAAANgUVCFqbWF4cAAAS9gAAAAgAAAAIAHvAJdubmFtZQAATCAAAAE7AAAB+FG2mylwb3N0AABNiAAAAHoAAACC40f/13ByZXAAAUcEAAAAnQAAAMGg7x+LeJxjYGRgYOBikGPQYWB0cfMJYeBgYGGAAJAMY05meiJQDMoDyrGAaQ4gZoOIAgCKIwNPAHicY2BkYWCcwMDKwMHUyXSGgYGhH0IzvmYwYuRgYGBiYGVmwAoC0lxTGBwYGJgBpR5BjP8H8jlAYQFZGA1GTAwAMusG9wB4nGNgZGBg4GIwYLBjYHJx8wlh4GBgYYAAkAxlDkB0lmY8BgABRRgBYnYGAAcYwAHAAAAAAAAAf//AAJ4nHWQy0oDMRBEb8PhUSoUxO+DQXwo8Qimth1V5HMBa2KnuhMuRzGJmV+bNo9N/rZ6x7FCKW3R3M1F/NRIRhV0pPdvXseMo4tzKq5rWBeeUXcfYUE6+jMsV1Yv81twgm8hx/9cI5jiB2b9DoekXeFluh9jsfkv2bsHV7lXW+MZ+4J3G5gB4nGNgQAYAAA4ABw==) format('woff2');
}
</style>
`;

/**
 * Inyecta las fuentes en el <head> y elimina links externos a Google Fonts
 */
function injectPoppinsFonts(html) {
  return html
    .replace(/<link[^>]+fonts\.googleapis[^>]+>/g, "")
    .replace(/<head>/i, `<head>${POPPINS_CSS}`);
}

app.post("/api/pdf", async (req, res) => {
  const { html, filename = "documento.pdf" } = req.body;
  if (!html) {
    return res.status(400).json({ error: "Falta el HTML" });
  }

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
