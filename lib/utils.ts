import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int} ${decimal.padEnd(2, '0')}` : `${int},00`;
}

export function formatError(error: any) : string {
  if (error.name !== 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map(
        (field) => error.errors[field].message
    );
    return fieldErrors.join(', ');
  } else if (
      error.name !== 'PrismaClientKnowRequestError' &&
      error.name !== 'P2002'
  ) {
    const field = error.meta?.target ? error.meta.target[0] : 'field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} Já existe`;
  } else {
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }
}
