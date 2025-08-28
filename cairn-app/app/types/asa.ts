// app/types/asa.ts
export interface AsaLogo {
  png: string;
  svg: string;
}

export interface AsaMetadata {
  id: string;
  name: string;
  unit_name: string;
  decimals: number;
  url: string;
  total_amount: string;
  logo: AsaLogo;
  deleted: boolean;
}

export interface AsaMetadataResponse {
  [asaId: string]: AsaMetadata;
}

export interface AsaContextType {
  asaMetadata: AsaMetadataResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  getAsaMetadata: (asaId: string) => AsaMetadata | undefined;
  getAsaLogo: (asaId: string) => AsaLogo | undefined;
}
