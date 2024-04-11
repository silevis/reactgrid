export function validateCellContext(type:string, maxLength: number | undefined, restraintType: string | undefined, text : string){
    if (["dropdown", "date", "time", "email", "chevron", "checkbox", "header"].includes(type)) return true;
    if (type === "text" && restraintType === "alphanumeric"){
        if (validateAlphanumeric(text)) return true;
        return false;
    }
    if (maxLength == null) return true
    if (text.length <= maxLength){
        return true;
    } else {
        return false;
    }   
}

function validateAlphanumeric(text : string){
    const isValid = /^[a-zA-Z0-9_\- ]*$/.test(text);
    return isValid;
}