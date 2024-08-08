import * as XLSX from "xlsx";

export const saveContentFile = async (instance, data) => {
  try {
    await instance.post("/fileContent/save", { array: data });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};

const getSellers = () => {
  const data = localStorage.getItem("sellers");
  const sellers = JSON.parse(data);
  return sellers?.map((seller) => {
    return seller.name;
  });
};

const cleanColumnName = (name) => {
  return name
    .replace(/[\r\n]/g, " ")
    .replace(/[^a-zA-Z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

export const getColumns = () => {
  const columns = ["Chipset", "Series", "VRAM", ...getSellers()];
  const cleanedColumns = columns.map(cleanColumnName);
  return cleanedColumns ?? [];
};

export const cleanedData = (data) => {
  const cleanedData = data?.map((row) => {
    const cleanedRow = {};
    for (let key in row) {
      const cleanedKey = cleanColumnName(key);
      cleanedRow[cleanedKey] = row[key];
    }

    return cleanedRow;
  });

  return cleanedData ?? [];
};

export const checkFilterAppy = (filters) => {
  let isValid = false;
  for (let key in filters) {
    if (filters[key]) {
      isValid = true;
      break;
    }
  }
  return isValid;
};

export const sortByTotalIntegers = (arr) => {
  return arr.sort((a, b) => {
    const sumIntegers = (obj) => {
      return Object.values(obj)
        .filter((value) => typeof value === "number" && Number.isInteger(value))
        .reduce((sum, value) => sum + value, 0);
    };

    const totalA = sumIntegers(a);
    const totalB = sumIntegers(b);

    return totalB - totalA;
  });
};

export const getSheet = () => {
  const data = new Uint8Array(event.target.result);
  const workbook = XLSX.read(data, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const range = XLSX.utils.decode_range(sheet["!ref"]);
  const columns = [];

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ c: C, r: 0 });
    const cell = sheet[cellAddress];
    let header = `Column${C + 1}`;
    if (cell && cell.v) {
      header = cell.v;
    }
    columns.push(header);
  }

  const json = XLSX.utils.sheet_to_json(sheet, { header: columns });

  return { json, columns };
};
