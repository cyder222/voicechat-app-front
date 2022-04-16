interface ThemeColor {
    bgColor?: string;
    normalColor?: string;
    lightColor?: string;
    subTextColor?: string;
    textColor?: string;
    accentColor?: string;
    accentColor2?: string;
}

const darkTheme: ThemeColor = {
    bgColor: "#0A0A0B",
    textColor: "#fff",
    subTextColor: "#fff",
    normalColor: "#202225",
    lightColor: "#2F3136",
    accentColor: "#EA4C89",
    accentColor2: "#4CEAC4",
};
  
const lightTheme: ThemeColor = {
    bgColor: "#0A0A0B",
    textColor: "#000000",
    subTextColor: "#9E9EA0",
    normalColor: "#EDF0F5",
    lightColor: "#F9F8FD",
    accentColor: "#EA4C89",
    accentColor2: "#4CEAC4",
};

export { darkTheme, lightTheme };
