export function evalToString(ast: any): string {
  switch (ast.type) {
    case "StringLiteral":
    case "Literal": // ESLint
      return ast.value;
    case "BinaryExpression": // `+`
      if (ast.operator !== "+") {
        throw new Error("Unsupported binary operator " + ast.operator);
      }
      return evalToString(ast.left) + evalToString(ast.right);
    default:
      throw new Error("Unsupported type " + ast.type);
  }
}

type Dict = { [key: string]: any };

export function invertObject(targetObj: Dict) {
  const result: Dict = {};
  const mapKeys = Object.keys(targetObj);

  for (const originalKey of mapKeys) {
    const originalVal = targetObj[originalKey];

    result[originalVal] = originalKey;
  }

  return result;
}
