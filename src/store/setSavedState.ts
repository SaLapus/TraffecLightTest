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

  const offsetStr = sessionStorage.getItem("offset");
  const offset = offsetStr && parseInt(offsetStr, 10);

  if (prev && current && offset)
    return {
      prev,
      current,
      offset: {
        time: offset,
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

  console.log("SET STATE");

  const color = colors.find((color) => color.name === preState.current);

  if (color) return preState;
  else return { prev: "", current: "green" };
}

export default setSavedState;
