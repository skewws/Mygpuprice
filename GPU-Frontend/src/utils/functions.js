export const filteredChipsets = (data, selectedSeries, selectedVram) => {
  const seriesChipsets = selectedSeries
    ? new Set(
        data
          .filter((item) => item.Series === selectedSeries)
          .map((item) => item.Chipset)
      )
    : new Set(data.map((item) => item.Chipset));

  const vramChipsets = selectedVram
    ? new Set(
        data
          .filter(
            (item) =>
              item.VRAM === selectedVram &&
              Array.from(seriesChipsets).includes(item.Chipset)
          )
          .map((item) => item.Chipset)
      )
    : seriesChipsets;

  return Array.from(vramChipsets);
};

export const filteredSeries = (data, selectedChipset, selectedVram) => {
  const chipsetSeries = selectedChipset
    ? new Set(
        data
          .filter((item) => item.Chipset === selectedChipset)
          .map((item) => item.Series)
      )
    : new Set(data.map((item) => item.Series));

  const vramSeries =
    selectedVram && selectedChipset !== ""
      ? new Set(
          data
            .filter(
              (item) =>
                item.VRAM === selectedVram && item.Chipset === selectedChipset
            )
            .map((item) => item.Series)
        )
      : selectedVram
      ? new Set(
          data
            .filter((item) => item.VRAM === selectedVram)
            .map((item) => item.Series)
        )
      : chipsetSeries;

  return Array.from(vramSeries);
};

export const filteredVram = (data, selectedChipset, selectedSeries) => {
  const chipsetVram = selectedChipset
    ? new Set(
        data
          .filter((item) => item.Chipset === selectedChipset)
          .map((item) => item.VRAM)
      )
    : new Set(data.map((item) => item.VRAM));

  const seriesVram = selectedSeries
    ? new Set(
        data
          .filter((item) => item.Series === selectedSeries)
          .map((item) => item.VRAM)
      )
    : chipsetVram;

  return Array.from(seriesVram);
};

export const isShowData = (chipset, series, vram) => {
  return chipset !== "" && series !== "" && vram !== "";
};


export const quillModules = {
  toolbar: [
    [{ 'size': ['small', false, 'large', 'huge'] }],  
    ['bold', 'italic', 'underline', 'strike'],        
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],     
    ['link', 'image'],                                
  ],
};


export const formats = [
  'size', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'link', 'image'
];
