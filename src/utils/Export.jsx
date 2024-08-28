// import React from 'react';
// import * as FileSaver from "file-saver";
// import * as XLSX from "xlsx";

// const Export = ({ apiData, fileName }) => {

//     const fileType =
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
//   const fileExtension = ".xlsx";

//   const exportToCSV = (apiData, fileName) => {
//     const ws = XLSX.utils.json_to_sheet(apiData);
//     const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     const data = new Blob([excelBuffer], { type: fileType });
//     FileSaver.saveAs(data, fileName + fileExtension);
//   };

//   return (
//     <button onClick={exportToCSV} className="bg-green-500 text-white border border-green-600 hover:bg-green-600 hover:border-green-700 px-4 py-2 rounded">Export</button>
//     // <button onClick={handleExport} className="bg-green-500 text-white px-4 py-2 rounded">
//     //   Export to Excel
//     // </button>
//   );
// };

// export default Export;