import * as React from 'react';
// MUI components for UI building
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// Custom auth context (contains handleRegister & handleLogin)
import { AuthContext } from '../contexts/AuthContext';
import { Snackbar } from '@mui/material';

// Default MUI theme (can be customized)
const defaultTheme = createTheme();

export default function Authentication() {

    // State for form inputs and feedback
    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [name, setName] = React.useState();
    const [error, setError] = React.useState();
    const [message, setMessage] = React.useState();

    // formState = 0 → Login, formState = 1 → Register
    const [formState, setFormState] = React.useState(0);

    // Snackbar open/close state
    const [open, setOpen] = React.useState(false);

    // Pull login/register handlers from context
    const { handleRegister, handleLogin } = React.useContext(AuthContext);

    // Handles both login and registration logic
    let handleAuth = async () => {
        try {
            if (formState === 0) {
                // Login flow
                let result = await handleLogin(username, password);
            }
            if (formState === 1) {
                // Registration flow
                let result = await handleRegister(name, username, password);
                console.log(result);
                // Reset fields after successful register
                setUsername("");
                setMessage(result); // Show success message in snackbar
                setOpen(true);
                setError("")
                setFormState(0) // Switch back to login form
                setPassword("")
            }
        } catch (err) {
            // Handle errors (from backend, e.g. invalid credentials)
            console.log(err);
            return;
            let message = (err.response.data.message);
            setError(message);
        }
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            {/* Full height grid layout (2 columns: image + form) */}
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                {/* Left side background image */}
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                {/* Right side: login/register form */}
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {/* Lock icon avatar */}
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>

                        {/* Toggle buttons: Sign In / Sign Up */}
                        <div>
                            <Button
                                variant={formState === 0 ? "contained" : ""}
                                onClick={() => { setFormState(0) }}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant={formState === 1 ? "contained" : ""}
                                onClick={() => { setFormState(1) }}
                            >
                                Sign Up
                            </Button>
                        </div>

                        {/* Form fields */}
                        <Box component="form" noValidate sx={{ mt: 1 }}>
                            {/* Full Name field only visible in Sign Up mode */}
                            {formState === 1 ? (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Full Name"
                                    name="username"
                                    value={name}
                                    autoFocus
                                    onChange={(e) => setName(e.target.value)}
                                />
                            ) : <></>}

                            {/* Username field */}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                value={username}
                                autoFocus
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            {/* Password field */}
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                            />

                            {/* Error message display */}
                            <p style={{ color: "red" }}>{error}</p>

                            {/* Submit button (Login/Register depending on formState) */}
                            <Button
                                type="button"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleAuth}
                            >
                                {formState === 0 ? "Login " : "Register"}
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>

            {/* Snackbar for showing messages (e.g. registration success) */}
            <Snackbar
                open={open}
                autoHideDuration={4000}
                message={message}
            />
        </ThemeProvider>
    );
}
