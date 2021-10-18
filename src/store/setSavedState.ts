interface ColorState {
  prev: string;
  current: string;
  offset?: {
    time: number;
    checked: boolean;
  };
}

interface Color {
  name: string;
}

function getSavedState(): ColorState {
  const prev = sessionStorage.getItem("prevColor");
  const current = sessionStorage.getItem("curColor");

  const offset = sessionStorage.getItem("offset");

  if (prev != undefined && current && offset)
    return {
      prev,
      current,
      offset: {
        time: parseInt(offset, 10),
        checked: false,
      },
    };
  else {
    const path = location.pathname;
    return { prev: "", current: path.substr(1) };
  }
}

function setSavedState(colors: Color[]): ColorState {
  const preState = getSavedState();

  const color = colors.find((color) => color.name === preState.current);

  if (color) return preState;
  else return { prev: "", current: "green" };
}

export default setSavedState;
