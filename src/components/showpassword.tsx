function PasswordButton() {
    return (
    <button
        onClick={(e) => {
            e.preventDefault()
            const passwordInput = document.querySelector('input[name="password"]')!
            if (passwordInput.getAttribute('type') === 'password') {
                passwordInput.setAttribute('type', 'text')
                e.currentTarget.classList.add('bg-eye-off-icon')
            }
            else {
                passwordInput.setAttribute('type', 'password')
                e.currentTarget.classList.remove('bg-eye-off-icon')
            }
        }}
        className={`bg-eye-icon cursor-pointer w-7 h-6 bg-no-repeat bg-center absolute right-2 top-2`}>
        <span className='sr-only'>show password</span>
    </button>);
}

export default PasswordButton;