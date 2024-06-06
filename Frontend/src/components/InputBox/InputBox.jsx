import React from "react";
import {useFormContext} from "react-hook-form";

const InputBox = ({name, rules, ...rest}) => {
    const {register, formState: {errors}} = useFormContext();
    return (
        <div>
            <input {...register(name, rules)} {...rest}></input>
            {errors[name] && <span>{errors[name].message}</span>}
        </div>
    );
};

export default InputBox;
