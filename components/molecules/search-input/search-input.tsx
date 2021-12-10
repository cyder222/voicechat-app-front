import React, { ChangeEvent, FormEvent, useCallback, useRef, useState } from "react";
import styled from "styled-components";

interface OwnProps {
    placeholder?: string;
    onSubmit?: (value: string) => void;
}

type Props = OwnProps;

interface SearchInputProps {
  selected?: boolean;
  onSubmit?: (value: string) => void;
}

const SearchInputWrapper = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 40px;
  max-width: 204px;
  padding: 0 10px;
  left: 0;
  top: 0;
  border-radius: 5px;
  outline: 0;
  border-color: #FDEDF3;
  border: ${(props: SearchInputProps): string => { return props.selected ? "5px solid #FDEDF3" : "1px solid #CCC";}};
  background:  ${(props: SearchInputProps): string => { return props.selected ? "#FFF" : "#EDF0F5";}};
  margin: ${(props: SearchInputProps): string => { return props.selected ? "0px 0px" : "4px 4px";}};
`;

const InputIconBtn = styled.button`
  border: none;
  background: ${(props: SearchInputProps): string => { return props.selected ? "#FFF" : "#EDF0F5";}};
`;
const InputIcon = styled.img`
  width: 25px;
  height: 25px;
  display: block;
`;

const Input = styled.input`
   background:  ${(props: SearchInputProps): string => { return props.selected ? "#FFF" : "#EDF0F5";}};
   border: none;
   outline: 0;
   text-align: center;
   width: 100%;
   height: calc(100% - 2px);
   &:focus{
     border: none;
     background: transparent;
   }
`;



const SearchInput = ({ placeholder="search...", onSubmit }: Props ): JSX.Element=>{
    const [selected, setSelected] = useState(false);
    const textInputRef = useRef<HTMLInputElement>();
    const formRef = useRef<HTMLFormElement>();

    const handleOnClickBtn = useCallback(
      (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        if(formRef && formRef.current){
          if (textInputRef && textInputRef.current &&  onSubmit) {
            onSubmit(textInputRef.current.value);
          }
        }
      },
    []);

    return (<SearchInputWrapper ref={formRef} selected={selected}>
        <InputIconBtn selected={selected} onClick={handleOnClickBtn}><InputIcon src="/img/search_icon.svg"></InputIcon></InputIconBtn>
        <Input style={{ border: "none" }} selected={selected} ref={textInputRef} onFocus={(): void=>{setSelected(true);}} onBlur={(): void=>{setSelected(false);}}  placeholder={!selected ? placeholder: ""}></Input>
    </SearchInputWrapper>);
}
;
export default SearchInput;
