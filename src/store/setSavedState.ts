interface ColorState {
  prev: string;
  current: string;
}

interface Color {
  name: string;
}

function getSavedState(): ColorState {
  const prev = sessionStorage.getItem("prevColor");
  const current = sessionStorage.getItem("curColor");

  if (prev && current) return { prev, current };
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
