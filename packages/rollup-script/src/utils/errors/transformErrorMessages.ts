import fs from "fs";
import { invertObject, evalToString } from "./helper";
import { addDefault } from "@babel/helper-module-imports";
import { resolveApp } from "@laconic/utils";

export default function transformErrorMessages(babel: any) {
  const t = babel.types;

  const DEV_EXPRESSION = t.identifier("__DEV__");

  return {
    visitor: {
      CallExpression(path: any, file: any) {
        const node = path.node;
        const noMinify = file.opts.noMinify;
        if (path.get("callee").isIdentifier({ name: "invariant" })) {
          const condition = node.arguments[0];
          const errorMsgLiteral = evalToString(node.arguments[1]);
          const errorMsgExpressions = Array.from(node.arguments.slice(2));
          const errorMessageQuasi = errorMsgLiteral
            .split("%s")
            .map((raw: any) =>
              t.templateElement({ raw, cooked: String.raw({ raw } as any) })
            );

          // Import ReactError
          const reactErrorIdentifier = addDefault(
            path,
            resolveApp("/errors/ErrorDev.js"),
            {
              nameHint: "InvariantError",
            }
          );

          // Outputs:
          //   throw ReactError(`A ${adj} message that contains ${noun}`);
          const devThrow = t.throwStatement(
            t.callExpression(reactErrorIdentifier, [
              t.templateLiteral(errorMessageQuasi, errorMsgExpressions),
            ])
          );

          if (noMinify) {
            path.replaceWith(
              t.ifStatement(
                t.unaryExpression("!", condition),
                t.blockStatement([devThrow])
              )
            );
            return;
          }

          // Avoid caching because we write it as we go.
          const existingErrorMap = JSON.parse(
            fs.readFileSync(resolveApp("errors/codes.json"), "utf-8")
          );
          const errorMap = invertObject(existingErrorMap);

          let prodErrorId = errorMap[errorMsgLiteral];

          if (prodErrorId === undefined) {
            path.replaceWith(
              t.ifStatement(
                t.unaryExpression("!", condition),
                t.blockStatement([devThrow])
              )
            );
            path.addComment(
              "leading",
              "FIXME (minify-errors-in-prod): Unminified error message in production build!"
            );
            return;
          }
          prodErrorId = parseInt(prodErrorId, 10);

          // Import ReactErrorProd
          const reactErrorProdIdentfier = addDefault(
            path,
            resolveApp("/errors/ErrorProd.js"),
            {
              nameHint: "InvariantErrorProd",
            }
          );

          // Outputs:
          //   throw ReactErrorProd(ERR_CODE, adj, noun);
          const prodThrow = t.throwStatement(
            t.callExpression(reactErrorProdIdentfier, [
              t.numericLiteral(prodErrorId),
              ...errorMsgExpressions,
            ])
          );

          path.replaceWith(
            t.ifStatement(
              t.unaryExpression("!", condition),
              t.blockStatement([
                t.ifStatement(
                  DEV_EXPRESSION,
                  t.blockStatement([devThrow]),
                  t.blockStatement([prodThrow])
                ),
              ])
            )
          );
        }
      },
    },
  };
}
