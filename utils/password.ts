function generateStrongPassword(length: number = 8): string {
    if (length < 8) {
        throw new Error("Password length should be at least 8 characters.");
    }

    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const allChars = upper + lower + digits + symbols;

    const passwordChars: string[] = new Array(length);

    passwordChars[0] = upper[Math.floor(Math.random() * upper.length)];
    passwordChars[1] = lower[Math.floor(Math.random() * lower.length)];
    passwordChars[2] = digits[Math.floor(Math.random() * digits.length)];
    passwordChars[3] = symbols[Math.floor(Math.random() * symbols.length)];

    for (let i = 4; i < length; i++) {
        passwordChars[i] = allChars[Math.floor(Math.random() * allChars.length)];
    }

    for (let i = passwordChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = passwordChars[i];
        passwordChars[i] = passwordChars[j];
        passwordChars[j] = temp;
    }

    return passwordChars.join('');
}

export default generateStrongPassword;
