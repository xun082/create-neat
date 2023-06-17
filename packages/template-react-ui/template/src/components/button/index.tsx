import React from 'react';
import { ButtonWrapper } from './style';

interface ButtonTypes {
  label: string;
}

const Button = (props: ButtonTypes) => {
  return <ButtonWrapper>{props.label}</ButtonWrapper>;
};

export default Button;
