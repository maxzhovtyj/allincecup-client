import {ThemeProvider} from "@mui/material/styles";
import {muiTextBtnTheme} from "../styles";
import {Button} from "@mui/material";

function AllianceButton({onClick, variant, align, mb, mt, children, disabled}) {
    const styles = {
        display: "flex",
        justifyContent: align || "left",
        marginBottom: mb,
        marginTop: mt
    }
    return (
        <ThemeProvider theme={muiTextBtnTheme}>
            <Button
                disabled={disabled}
                sx={styles}
                onClick={onClick}
                variant={variant || "outlined"}
                color="alliance"
            >
                {children}
            </Button>
        </ThemeProvider>
    );
}

export default AllianceButton;