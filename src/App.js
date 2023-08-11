import React, { useState } from "react";
import * as ExcelJS from "exceljs";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h2>Upload excel sheet and extract data</h2>
      <ExcelDataExtractor />
    </div>
  );
}

export default App;

const ExcelDataExtractor = () => {
  const [fileData, setFileData] = useState(null);
  console.log("fileDATA", fileData);

  // Function to handle the file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file);

        const worksheet = workbook.worksheets[0];
        const headers = worksheet.getRow(1).values;
        const rows = [];

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber !== 1) {
            const rowData = {};
            row.eachCell((cell, colNumber) => {
              rowData[headers[colNumber]] = cell.value;
            });
            rows.push(rowData);
          }
        });

        setFileData(rows);
      } catch (error) {
        console.error("Error reading the Excel file:", error);
      }
    }
  };

  return (
    <div>
      <div>
        <input type="file" onChange={handleFileUpload} />
      </div>

      {fileData && (
        <div>
          <table>
            <thead>
              <tr>
                {Object.keys(fileData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fileData.map((rowData, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(rowData).map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
