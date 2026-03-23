import React from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';

interface ExportButtonsProps {
  data: any[];
  filename: string;
  title?: string;
}

export default function ExportButtons({ data, filename, title }: ExportButtonsProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    if (!data || data.length === 0) return;
    
    // Simple HTML to PDF conversion using window.print
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const headers = Object.keys(data[0]);
    const tableHTML = `
      <html>
        <head>
          <title>${title || filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>${title || filename}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                ${headers.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${headers.map(header => `<td>${row[header] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const exportToGoogleSheets = () => {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(','))
    ].join('\n');
    
    // Create a data URI for the CSV
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    
    // Create a temporary link to trigger download
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show instructions for Google Sheets
    alert('CSV file downloaded! You can now:\n1. Open Google Sheets\n2. Click "File" > "Import"\n3. Upload the downloaded CSV file');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportToGoogleSheets}
        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        title="Export to Google Sheets (CSV)"
      >
        <FileSpreadsheet className="w-4 h-4" />
        Sheets
      </button>
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        title="Export to PDF"
      >
        <Download className="w-4 h-4" />
        PDF
      </button>
    </div>
  );
}
