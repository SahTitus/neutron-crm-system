import * as XLSX from 'xlsx';
import html2canvas from "html2canvas";
import { saveAs } from 'file-saver';

export const exportToCSV = (data, filename) => {
    const csvContent = [
        Object.keys(data[0]).join(","), // Header row
        ...data.map(item => Object.values(item).join(",")) // Data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${filename}.csv`);
};


export const exportToExcel = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToImage = (element, filename) => {
    html2canvas(element).then(canvas => {
        canvas.toBlob(blob => {
            saveAs(blob, `${filename}.png`);
        });
    });
};
