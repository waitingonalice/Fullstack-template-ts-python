let swc: typeof import("@swc/wasm-web") | null = null;

export async function transpile(codeString: string) {
  if (swc === null) {
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const module = await import("@swc/wasm-web");
    await module.default();
    swc = module;
  }
  return swc.transformSync(codeString, {
    jsc: {
      parser: {
        syntax: "typescript",
      },
      minify: {
        format: {
          comments: false,
        },
      },
    },
    module: {
      type: "es6",
    },
  }).code;
}
