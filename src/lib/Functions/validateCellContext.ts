import { max } from "cypress/types/lodash";

export function validateCellContext(type:string, maxLength: number | undefined, restraintType: string | undefined, text : string){
    if (["dropdown", "date", "time", "email", "chevron", "checkbox", "header"].includes(type)) return true;
    let isAlphanumeric = false;
    if (type === "text" && restraintType === "alphanumeric"){
        isAlphanumeric = true;
    }
    if(isAlphanumeric){
        if (validateAlphanumeric(text) && validateLength(text.length, maxLength)) return true
    } else {
        if (validateLength(text.length, maxLength)) return true
    }
    return false
}

function validateAlphanumeric(text : string){
    const isValid = /^[a-zA-Z0-9_\- ]*$/.test(text);
    return isValid;
}

function validateLength(textLength:number, maxLength:number | undefined){
    if (!maxLength) return true;
    if (textLength <= maxLength){
        return true;
    } else {
        return false;
    }   
}