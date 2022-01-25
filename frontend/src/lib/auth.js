// To check if user is logged in
const user_is_authenticated = () => {
    return localStorage.getItem('token');
}

// Get the user's type
const user_type = () => {
    return localStorage.getItem('user_type');
}

// Destroy the user's tokens on logout
const user_logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_type');
}

export { user_is_authenticated, user_type, user_logout };