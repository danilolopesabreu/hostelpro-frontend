import { Papel } from "./papel.model";
import { Permissao } from "./permissao.model";

export const PAPEL_ADMINISTRADOR = new Papel({ 
    id:1, nome: 'ADMIN', 
    permissoes: [
        new Permissao(
        { 
            id:1,
            nome: 'vender' 
        }),
        new Permissao(
        { 
            id:2,
            nome: 'editarProduto' 
        })
    ] 
});
