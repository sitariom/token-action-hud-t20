# Changelog

## [1.4.1] - 2026-03-16
### Corrigido
- Correção crítica na lógica de localização de Atributos e Perícias para evitar nomes indefinidos.
- Correção na categorização de Magias e Poderes para garantir que itens sejam encontrados e exibidos nos grupos corretos.
- Fallback manual para nomes de atributos (Força, Destreza, etc.) caso a localização do sistema falhe.

## [1.4.0] - 2026-03-16
### Adicionado
- Nova categoria **Condições** para gerenciar status effects no token.
- Categorização de **Magias** por Círculo (1º a 5º).
- Categorização de **Poderes** por Tipo (Classe, Geral, Origem, Tormenta, Destino).
- Melhoria na exibição dos nomes de Atributos e Perícias (fallback para nomes da configuração do sistema).
- Documentação de testes (`TESTS.md`).

### Corrigido
- Correção de erro "undefined" ao rolar Atributos e Perícias (agora usa a chave correta).

## [1.3.0] - 2024-03-16
### Adicionado
- Suporte inicial para o sistema Tormenta20.
- Integração com Token Action HUD Core.
- Ações para Atributos, Perícias, Armas, Equipamentos, Consumíveis, Magias e Poderes.
