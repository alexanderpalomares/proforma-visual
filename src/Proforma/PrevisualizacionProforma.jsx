const handleExportPDF = async () => {
  try {
    setGenerando(true);

    // 🖼️ 1️⃣ Reemplazar todas las imágenes por Base64
    const imgs = containerRef.current.querySelectorAll("img");

    await Promise.all(
      Array.from(imgs).map(async (img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("data:")) {
          try {
            const dataUrl = await toDataURL(src);
            img.setAttribute("src", dataUrl);
          } catch (e) {
            console.warn(`No se pudo convertir la imagen ${src} a Base64`, e);
          }
        }
      })
    );

    // 🧱 2️⃣ Obtener el HTML limpio y estructurarlo correctamente
    const rawHTML = containerRef.current.innerHTML;

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            margin: 0;
            padding: 0;
          }
          * {
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        ${rawHTML}
      </body>
      </html>
    `;

    // 📝 3️⃣ Enviar el HTML al servidor PDF
    const filename = `PROFORMA_${proformaNumber}.pdf`;

    const response = await fetch(`${PDF_SERVER_URL}/api/pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html, filename }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al generar PDF: ${errorText}`);
    }

    // 📥 4️⃣ Descargar el PDF
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    // 🔢 5️⃣ Avanzar numeración local
    getNextProformaNumber();
  } catch (err) {
    console.error("❌ Error en exportación PDF:", err);
    alert("Error al generar el PDF. Revisa la consola para más detalles.");
  } finally {
    setGenerando(false);
  }
};
