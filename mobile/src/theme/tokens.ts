// Design tokens ported verbatim from ../../../README.md "Design Tokens" section
// ("Modernist" system, softened per client request — rounded corners, hairline rules, soft cards).

export const color = {
  ground: "#f1efee",
  canvasGround: "#f3f2f2",
  surface: "#ffffff",
  ink: "#201e1d",
  accent: "#ec3013",
  accent600: "#dd2b0f",
  accent700: "#ae1800",
  accent100: "#fff2ef",
  accent500: "#ff563c",
  accent900: "#4d170e",
  hairline: "rgba(32,30,29,0.10)",
  softBorder: "rgba(32,30,29,0.15)",
  mutedText: "rgba(32,30,29,0.55)",
  dimText: "rgba(32,30,29,0.63)",
  track: "rgba(32,30,29,0.10)",
  ringTrack: "rgba(32,30,29,0.18)",
};

export const font = {
  regular: "Archivo_400Regular",
  semibold: "Archivo_600SemiBold",
  bold: "Archivo_800ExtraBold",
};

export const type = {
  heroMetric: { fontSize: 74, lineHeight: 61, letterSpacing: -2.96, fontFamily: font.bold },
  streakMetric: { fontSize: 62, lineHeight: 53, letterSpacing: -2.48, fontFamily: font.bold },
  screenTitle: { fontSize: 24, lineHeight: 28, fontFamily: font.bold },
  cardTitle: { fontSize: 15, lineHeight: 19, fontFamily: font.bold },
  statNumber: { fontSize: 30, lineHeight: 30, fontFamily: font.bold },
  smallStatNumber: { fontSize: 22, lineHeight: 22, fontFamily: font.bold },
  body: { fontSize: 14, lineHeight: 20, fontFamily: font.regular },
  rowTitle: { fontSize: 13.5, lineHeight: 18, fontFamily: font.bold },
  caption: { fontSize: 12, lineHeight: 17, fontFamily: font.regular },
  eyebrow: { fontSize: 10, letterSpacing: 1.6, fontFamily: font.bold, textTransform: "uppercase" as const },
  tabLabel: { fontSize: 9, letterSpacing: 0.8, fontFamily: font.bold, textTransform: "uppercase" as const },
  categoryTag: { fontSize: 8.5, letterSpacing: 1, fontFamily: font.bold, textTransform: "uppercase" as const },
};

export const space = {
  base: 4,
  cardGutter: 14,
  cardGapV: 12,
  cardPadding: 18,
  tilePadding: 16,
  gridGap: 8,
};

export const radius = {
  card: 24,
  tabBarTop: 26,
  addButton: 22,
  tile: 20,
  hint: 16,
  input: 14,
  pill: 999,
  chartBarTop: 10,
};

export const shadow = {
  card: {
    shadowColor: "#2d2b2b",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBar: {
    shadowColor: "#2d2b2b",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 8,
  },
  dragged: {
    shadowColor: "#2d2b2b",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 16,
  },
  banner: {
    shadowColor: "#2d2b2b",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.34,
    shadowRadius: 32,
    elevation: 16,
  },
};

export const categoryStyle = {
  Lecture: { fill: color.ink, border: color.ink, text: color.surface },
  Lab: { fill: color.canvasGround, border: color.ink, text: color.ink },
  Clinical: { fill: color.accent, border: color.accent, text: color.surface },
  Study: { fill: color.accent100, border: color.accent500, text: color.accent900 },
} as const;
