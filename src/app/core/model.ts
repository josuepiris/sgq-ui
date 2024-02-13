export class Departamento {
  codigo: number;
  ativo: boolean;
  nome: string;
}

export class Permissao {
  codigo: number;
  roleName: string;
  descricao: string;
}

export class Pessoa {
  funcionarioId: number;
  ativo: boolean;
  nome: string;
  departamento: Departamento;
  userId: string;
  senha: string;
  permissao: Permissao[];
}
