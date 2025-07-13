"use client";

// Désactiver le pré-rendu pour cette page PDF
export const dynamic = 'force-dynamic';

import { StoreProvider } from "@/app/StoreProvider";
import PdfCashControl from "@/lib/pdf/pdf-CashControl";
import { usePDF } from "@react-pdf/renderer";
import { ReactElement, useCallback, useState } from "react";
import { Document as PDFDocument, pdfjs, Page as PDFPage } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Page() {
  const [document] = usePDF({ 
    document: <PdfCashControl 
      data={[]} 
      selectedMonth={null} 
      selectedYear={null} 
    /> 
  });

  // Generate all the document pages.
  const [pages, setPages] = useState<ReactElement[]>([]);

  // Ref used to generate the pages on load.
  const onLoadSucces = useCallback(function generatePages(
    pdf: pdfjs.PDFDocumentProxy,
  ) {
    const newPages: ReactElement[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      newPages.push(<PDFPage key={i} pageNumber={i} />);
    }
    setPages(newPages);
  }, []);

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
        <a href={document.url ?? undefined} download="cash-control.pdf">
          Download PDF
        </a>
        <StoreProvider>
          <PDFDocument file={document.url} onLoadSuccess={onLoadSucces}>
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              {pages}
            </div>
          </PDFDocument>
        </StoreProvider>
      </div>
    </div>
  );
}
