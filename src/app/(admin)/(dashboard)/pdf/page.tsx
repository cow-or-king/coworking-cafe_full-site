"use client";
// Désactiver le pré-rendu pour cette page PDF
export const dynamic = "force-dynamic";

import { usePDF } from "@react-pdf/renderer";
import { Document as PDFDocument, pdfjs, Page as PDFPage } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import TestDocument from "./document";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Page() {
  const [document] = usePDF({
    document: <TestDocument />,
  });

  if (document.loading) {
    return <div>Loading document...</div>;
  }
  if (document.error) {
    console.error(document.error);
    return <div>Error loading document: {JSON.stringify(document.error)}</div>;
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full max-w-3xl flex-col items-center justify-center gap-4 p-4">
        <a href={document.url ?? undefined} download="test-document.pdf">
          Download PDF
        </a>
        <PDFDocument file={document.url}>
          <PDFPage
            pageNumber={1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        </PDFDocument>
      </div>
    </div>
  );
}
