"use client";

import { StoreProvider } from "@/app/StoreProvider";
import PDFCashControl from "@/lib/pdf/pdf-CashControl";
import { usePDF } from "@react-pdf/renderer";
import { Document as PDFDocument, pdfjs, Page as PDFPage } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function Page() {
  const [document] = usePDF({
    document: <PDFCashControl />,
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
        <a href={document.url ?? undefined} download="cash-control.pdf">
          Download PDF
        </a>
        <StoreProvider>
          <PDFDocument file={document.url}>
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              <PDFPage pageNumber={1} />
              <PDFPage pageNumber={2} />
              {/* <PDFPage pageNumber={3} />
            <PDFPage pageNumber={4} /> */}
            </div>
          </PDFDocument>
        </StoreProvider>
      </div>
    </div>
  );
}
