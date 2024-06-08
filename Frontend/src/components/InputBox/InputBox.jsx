import React from "react";
import {useFormContext} from "react-hook-form";

const InputBox = ({name, rules, ...rest}) => {
    const {register, formState: {errors}} = useFormContext();
    return (
        <div className="relative pt-4">
            <input
                {...register(name, rules)}
                {...rest}
                className="font-txtSecondary h-12 w-72 rounded-xl bg-bgSecondary px-4 text-txtSecondary placeholder-txtSecondary focus:outline-none"
            ></input>
            <div className="h-4 text-red-500 text-xs absolute">{" "}{errors[name] && <span>{errors[name].message}</span>}</div>
        </div>
    );
};

export default InputBox;
