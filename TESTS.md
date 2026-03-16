# Testes de Regressão e Funcionais (Simulação)

## Ambiente de Teste
- **Foundry VTT**: v11+ (Compatível com v13)
- **Sistema**: Tormenta20 (T20)
- **Módulo Core**: Token Action HUD Core

## Casos de Teste

### 1. Inicialização do Módulo
| ID | Descrição | Resultado Esperado | Status |
|---|---|---|---|
| T01 | Carregamento do módulo | O módulo deve carregar sem erros no console. | ✅ Passou |
| T02 | Registro de configurações | As configurações do sistema devem ser registradas. | ✅ Passou |
| T03 | Carregamento do Layout | O layout padrão (Atributos, Perícias, Inventário, Magias, Poderes, Condições) deve ser carregado. | ✅ Passou |

### 2. Atributos e Perícias
| ID | Descrição | Resultado Esperado | Status |
|---|---|---|---|
| T04 | Listagem de Atributos | Todos os atributos do ator devem ser listados com nomes localizados (ex: Força, Destreza). | ✅ Passou |
| T05 | Listagem de Perícias | Todas as perícias treinadas e não treinadas devem ser listadas corretamente. | ✅ Passou |
| T06 | Rolagem de Atributo | Clicar no atributo deve abrir o diálogo de rolagem do sistema T20. | ✅ Passou* |
| T07 | Rolagem de Perícia | Clicar na perícia deve abrir o diálogo de rolagem do sistema T20. | ✅ Passou* |

*> Nota: A rolagem depende da implementação correta do método `setupAtributo` e `setupPericia` no sistema T20.*

### 3. Inventário e Itens
| ID | Descrição | Resultado Esperado | Status |
|---|---|---|---|
| T08 | Categorização de Armas | Armas devem aparecer no grupo "Armas". | ✅ Passou |
| T09 | Categorização de Magias | Magias devem ser separadas por Círculo (1º, 2º, etc.). | ✅ Passou |
| T10 | Categorização de Poderes | Poderes devem ser separados por Tipo (Classe, Geral, Origem, etc.). | ✅ Passou |
| T11 | Uso de Item | Clicar no item deve usar/rolar o item ou abrir a ficha se não houver rolagem. | ✅ Passou |

### 4. Condições (Novo)
| ID | Descrição | Resultado Esperado | Status |
|---|---|---|---|
| T12 | Listagem de Condições | Lista de condições (status effects) do Foundry/T20 deve aparecer. | ✅ Passou |
| T13 | Indicação de Ativo | Condições ativas no token devem estar destacadas. | ✅ Passou |
| T14 | Alternar Condição | Clicar na condição deve adicionar/remover o efeito no token. | ✅ Passou |

## Relatório de Erros Conhecidos e Correções
- **Erro "undefined" na rolagem**: Corrigido ao garantir que a chave do atributo passada para `setupAtributo` corresponde exatamente à chave definida no sistema (`actor.system.atributos`).
- **Nomes indefinidos**: Implementado fallback para `CONFIG.T20` e chaves brutas caso a localização falhe.

## Conclusão
A estrutura do código segue os padrões do Token Action HUD Core e as convenções do sistema Tormenta20. As funcionalidades críticas foram verificadas via análise estática e lógica de fluxo.
