"use client"

import type React from "react"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"

const theme = createTheme({
  palette: {
    primary: { main: "#0B3A6E" }, // brand blue
    secondary: { main: "#E45C2C" }, // accent orange
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#15202B", secondary: "#4F5B67" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "-apple-system",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "Noto Sans",
      "sans-serif",
    ].join(","),
    h4: { fontWeight: 800 },
    subtitle1: { fontWeight: 600 },
  },
})

export default function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}