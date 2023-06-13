import React from 'react';

interface ButtonTypes {
  label: string;
}

const Button = (props: ButtonTypes) => {
  return <button>{props.label}</button>;
};

export default Button;
