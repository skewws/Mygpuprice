const { useState, useEffect } = require("react")

const useReadFile=(uploadedFile)=>{
    const [fileContent, setFileContent] = useState([]);
    const [columnNames, setColumnNames] = useState([]);

    const getFileContent=()=>{
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet);
          if (json.length > 0) {
            const columns = Object.keys(json[0]);
            setColumnNames(columns);
          }
          setFileContent(json);
        };
        reader.readAsArrayBuffer(uploadedFile);
    }
    useEffect(()=>{
        if(uploadedFile) getFileContent()
    },[uploadedFile])

    return {fileContent,columnNames}
}

export default useReadFile