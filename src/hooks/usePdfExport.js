// src/hooks/usePdfExport.js
import { useCallback } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Exporta a PDF el contenido de targetRef.
 * Evita cortar filas si llevan .no-break, [page-break-inside:avoid] o [data-avoid-break="true"].
 *
 * @param {React.RefObject<HTMLElement>} targetRef
 * @param {{
 *  fileName?: string,
 *  dpiScale?: number,     // nitidez de la captura (2–3 recomendado, 3 por defecto)
 *  marginPt?: number,     // margen interno del PDF en puntos
 *  avoidBreaks?: boolean  // respetar filas/no cortar elementos marcados
 * }} opts
 */
export function usePdfExport(targetRef, opts = {}) {
  const {
    fileName = "proforma.pdf",
    dpiScale = 3,
    marginPt = 10,
    avoidBreaks = true,
  } = opts;

  const exportPdf = useCallback(async () => {
    const node = targetRef.current;
    if (!node) return;

    // Asegura que las fuentes estén listas para evitar reflujo entre vista y raster
    if (document.fonts && document.fonts.ready) {
      try { await document.fonts.ready; } catch {}
    }

    // 1) Si vamos a evitar cortes, medimos las filas/elementos antes de rasterizar.
    let rowBottomsCanvasPx = [];
    if (avoidBreaks) {
      const nodeRect = node.getBoundingClientRect();
      const candidates = node.querySelectorAll(
        '.no-break, [data-avoid-break="true"], [page-break-inside\\:avoid]'
      );
      rowBottomsCanvasPx = Array.from(candidates)
        .map((el) => {
          const r = el.getBoundingClientRect();
          const topRelCssPx = r.top - nodeRect.top; // relativo al contenedor
          const bottomRelCssPx = topRelCssPx + r.height;
          // Pasamos a px del canvas (html2canvas multiplica por scale)
          return Math.round(bottomRelCssPx * dpiScale);
        })
        .sort((a, b) => a - b);
    }

    // 2) Rasterizamos a canvas
    const canvas = await html2canvas(node, {
      scale: dpiScale,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 15000,
      windowWidth: node.scrollWidth,
      windowHeight: node.scrollHeight,
      // foreignObjectRendering: true, // habilítalo si usas CSS complejo y notas diferencias
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Dimensiones del canvas (px del canvas, ya incluyen el scale)
    const imgWidthPx = canvas.width;
    const imgHeightPx = canvas.height;

    // Conversión aproximada 96 dpi: 1px ≈ 0.75pt
    const pxToPt = 0.75;

    // Tamaño de la imagen completa en puntos (sin escalar aún)
    const imgWidthPt = imgWidthPx * pxToPt;
    const imgHeightPt = imgHeightPx * pxToPt;

    // Área útil en la página
    const maxW = pageWidth - marginPt * 2;
    const maxH = pageHeight - marginPt * 2;

    // 🔒 Escalamos BLOQUEANDO por ancho útil: respetamos el diseño 1:1 a lo ancho
    const ratioW = maxW / imgWidthPt;
    const renderW = maxW;
    const renderH = imgHeightPt * ratioW;

    // 🧾 Caso 1: cabe en una sola página
    if (renderH <= maxH) {
      pdf.addImage(
        imgData,
        "PNG",
        marginPt, // alineado al margen izquierdo
        marginPt, // alineado al margen superior
        renderW,
        renderH,
        undefined,
        "FAST"
      );
      pdf.save(fileName);
      return;
    }

    // 3) Multipágina: cortamos verticalmente usando el mismo ratioW
    const ptPerPx = pxToPt * ratioW; // puntos por px con el ratio de ANCHO
    const pageContentPt = maxH;
    const pageContentPx = Math.floor(pageContentPt / ptPerPx);

    // --- Ajustes anti-página vacía ---
    const MIN_REST_PX = Math.round(24 * dpiScale); // resto mínimo que justifica crear otra página

    let offsetPxY = 0;

    while (offsetPxY < imgHeightPx) {
      // Altura por defecto de la porción (en px de canvas)
      let sliceHeightPx = Math.min(pageContentPx, imgHeightPx - offsetPxY);

      // Evitar páginas residuales: si lo que quedaría después es muy pequeño, lo absorbemos
      const remainingAfter = imgHeightPx - (offsetPxY + sliceHeightPx);
      if (remainingAfter > 0 && remainingAfter < MIN_REST_PX) {
        sliceHeightPx += remainingAfter; // estira esta rebanada para consumir el resto
      }

      if (avoidBreaks && rowBottomsCanvasPx.length) {
        // Buscar mejor corte <= límite para no partir filas
        const seguridadPx = Math.max(6 * dpiScale, 12);
        const limit = offsetPxY + sliceHeightPx - seguridadPx;

        let bestCut = null;
        let lo = 0, hi = rowBottomsCanvasPx.length - 1;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (rowBottomsCanvasPx[mid] <= limit) {
            bestCut = rowBottomsCanvasPx[mid];
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }

        // Evita páginas “casi vacías”
        const minUseful = Math.min(80 * dpiScale, pageContentPx * 0.25);
        if (bestCut && bestCut > offsetPxY + minUseful) {
          sliceHeightPx = bestCut - offsetPxY;
        }
      }

      // Canvas temporal para la porción
      const pageCanvas = document.createElement("canvas");
      pageCanvas.width = imgWidthPx;
      pageCanvas.height = sliceHeightPx;

      const ctx = pageCanvas.getContext("2d");
      ctx.drawImage(
        canvas,
        0, offsetPxY, imgWidthPx, sliceHeightPx,   // src
        0, 0,         imgWidthPx, sliceHeightPx    // dst
      );

      const pageImg = pageCanvas.toDataURL("image/png");

      // Dimensiones de esta porción en puntos con ratioW
      const pageImgWpt = renderW; // siempre ancho útil
      const pageImgHpt = sliceHeightPx * ptPerPx;

      pdf.addImage(
        pageImg,
        "PNG",
        marginPt,
        marginPt,
        pageImgWpt,
        pageImgHpt,
        undefined,
        "FAST"
      );

      offsetPxY += sliceHeightPx;

      // Solo agrega nueva página si REALMENTE queda contenido
      if (offsetPxY < imgHeightPx) pdf.addPage();
    }

    pdf.save(fileName);
  }, [targetRef, fileName, dpiScale, marginPt, avoidBreaks]);

  return { exportPdf };
}
