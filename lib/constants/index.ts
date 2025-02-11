export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'CRStore';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_ESCRIPTION || 'A modern store built with Next.js';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT || 4);
export const signInDefaultValues = {
    email: 'admin@example.com',
    password: 123456,
};
export const signUpDefaultValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
};
export const shippingAddressDefaultValues = {
    fullName: 'John Doe',
    streetAddress: '123 Main st',
    city: 'Teresópolis',
    state: 'RJ',
    postalCode: '12345678',
    country: 'Brasil',
};