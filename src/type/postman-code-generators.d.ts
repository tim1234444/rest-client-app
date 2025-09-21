declare module 'postman-code-generators' {
    interface ConvertOptions {
      indentCount?: number;
      indentType?: string;
      trimRequestBody?: boolean;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Request {}
  
    function convert(
      language: string,
      variant: string,
      request: Request,
      options: ConvertOptions,
      callback: (error: Error | null, snippet: string) => void
    ): void;
  
    export { Request, convert };
    const Codegen: { convert: typeof convert };
    export default Codegen;
  }
  