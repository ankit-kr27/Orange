import React from "react";
import PropTypes from "prop-types";

const Button = ({
    type = "button",
    onClick = () => {},
    children,
    className = "",
    disabled = false,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

Button.propTypes = {
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

export default Button;
