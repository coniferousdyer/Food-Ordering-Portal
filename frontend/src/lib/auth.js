// To check if user is logged in
const user_is_authenticated = () => {
    return localStorage.getItem('token');
}

// Destroy the user's tokens on logout
const user_logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('type');
}

export { user_is_authenticated, user_logout };