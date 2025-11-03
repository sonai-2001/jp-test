import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const GradientButton = styled(Button)(({ theme }) => ({
  '&&': {
    backgroundImage:
      "linear-gradient(to right, #314755 0%, #26a0da 51%, #314755 100%)",
    textAlign: "center",
    textTransform: "uppercase",
    transition: "0.5s",
    backgroundSize: "200% auto",
    color: "#fff",
    boxShadow: "0 0 20px #eee",
    borderRadius: 10,
    fontWeight: 800,
    cursor: "pointer",

    // No clipping: allow wrapping and auto height
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight: 1.3,
    minHeight: "unset",
    overflow: "visible",
    padding: theme.spacing(1.25, 3),

    // Mobile-first: full width; usage sx adjusts on sm+
    width: "100%",
    margin: theme.spacing(1, 0), // vertical only

    "&:hover": {
      backgroundPosition: "right center",
      color: "#fff",
      textDecoration: "none",
    },
  },
}));

export default GradientButton;