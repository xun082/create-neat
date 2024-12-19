export type ProtocolType = "ENTRY_FILE" | "PROCESS_STYLE_PLUGIN" | "INSERT_IMPORT" | "ADD_CONFIG";

export interface ProtocolParams<T = Record<string, any>> {
  content?: T;
  priority?: number;
  imports?: Array<{
    dir: string;
    name: string;
    from: string;
  }>;
}

export interface Protocol<T = Record<string, any>> {
  type: ProtocolType;
  params: ProtocolParams<T>;
}
