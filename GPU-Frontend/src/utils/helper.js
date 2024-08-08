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
