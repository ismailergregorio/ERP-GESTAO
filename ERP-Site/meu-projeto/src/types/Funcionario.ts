export interface Funcionario { id:number; nome:string; cpf:string|null; ativo:boolean; dataCriacao:string; dataUpdate:string|null; }
export interface FuncionarioRequest { nome:string; cpf?:string; }
