import { RegisterSchema } from '@/schemas/register-schema'
import { Input } from '@nextui-org/react';
import React from 'react'

interface FormInputProps {
    id: keyof RegisterSchema;
    label: string;
    type: string;
    value?: string;
    errorMessage?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    accept?: string; 
}

const FormInput: React.FC<FormInputProps> = ({
    id,
    label,
    type,
    value,
    errorMessage,
    onChange,
    accept,
}) => {
    return (
        <div className='mb-4'>
            <Input
                label={label}
                type={type}
                id={id}
                value={type !== "file" ? value : undefined} // Value only for non-file types
                onChange={onChange}
                variant="bordered"
                accept={type === "file" ? accept : undefined} // Accept attribute for file inputs
            />
            <div className='text-red-500 text-xs text-right'>
                {errorMessage && <p>{errorMessage}</p>}
            </div>
        </div>
    );
};

export default FormInput;
