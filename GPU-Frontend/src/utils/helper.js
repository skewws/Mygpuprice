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

export const checkFilterAppy = (chipsetFilter, seriesFilter, vramFilter) => {
  return chipsetFilter !== "" || seriesFilter !== "" || vramFilter !== "";
};

const sortSellersByPrice = (sellers) => {
  return sellers.sort((a, b) => b.price - a.price);
};

export const sortByTotalIntegers = (arr, sellers) => {
  if (arr?.length > 0) {
    const obj = arr[0];
    const sellersN = [];
    sellers?.forEach((seller) => {
      if (obj[seller.name]) {
        sellersN.push({ ...seller, price: obj[seller.name] });
      }
    });

    return sortSellersByPrice(sellersN);
  }
  return [];
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

function transformKeys(obj) {
  const transformedObj = {};

  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const newKey = key?.toLowerCase().replace(/\s+/g, "");
      transformedObj[newKey] = obj[key];
    }
  }

  return transformedObj;
}

export const transformArray = (data) => {
  if (data?.length > 0) {
    return data.map(transformKeys);
  } else return [];
};

const removeKeys = (obj, keysToRemove) => {
  const updatedObj = { ...obj };

  keysToRemove.forEach((key) => delete updatedObj[key]);

  return updatedObj;
};

export const removeKeysFromArray = (data) => {
  const keysToRemove = ["Chipset", "Series", "VRAM"];
  if (data?.length > 0) {
    return data?.map((obj) => removeKeys(obj, keysToRemove));
  } else return [];
};
