import { VariableItem, headersList } from "../type/type";

export function substitute(template: string, variables: VariableItem[]): string {
    return template.replace(/{{(.*?)}}/g, (fullValue, key) => {
      const found = variables.find((v) => v.varName === key.trim());
      return found ? found.varValue : fullValue;
    });
  }
export function substituteHeaders(headers: headersList, variables: VariableItem[]): headersList {
    return headers.map((header) => ({
      key: substitute(header.key, variables),
      value: substitute(header.value, variables),
    }));
  }