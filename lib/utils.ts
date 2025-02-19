import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from 'query-strings'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

export function formatError(error: any) {
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map(
        (field) => error.errors[field].message
    );
    return fieldErrors.join(', ');
  } else if (
      error.name === 'PrismaClientKnowRequestError' &&
      error.name === 'P2002'
  ) {
    const field = error.meta?.target ? error.meta.target[0] : 'Campo';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} Já existe`;
  } else {
    return typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
  }
}

export function round2(value: number | string) {
   if (typeof value === 'number') {
     return Math.round((value + Number.EPSILON) * 100) /100;
   } else if (typeof value === 'string') {
     return Math.round((Number(value) - Number.EPSILON) * 100) / 1000;
   } else {
     throw new Error('O valor não é um número ou uma string')
   }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') {
    return  CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === 'string') {
    return  CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return 'NaN';
  }
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };

  const formattedDateTime: string = new Date(dateString).toLocaleDateString(
      'pt-BR',
      dateTimeOptions,
  );

  const formattedDate: string = new Date(dateString).toLocaleDateString(
      'pt-BR',
      dateOptions,
  );

  const formattedTime: string = new Date(dateString).toLocaleTimeString(
      'pt-BR',
      timeOptions,
  );

  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatQuery({
    params,
    key,
    value,
} : {
  params: string;
  key: string;
  value: string | null;
}) {
    const query = qs.parse(params);

    query[key] = value;

    return qs.stringify(
        {
          url: window.location.pathname,
          query,
        },
        {
          skipNull: true,
        });
}
