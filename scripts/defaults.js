export const DEFAULTS = {
    layout: [
        {
            nestId: 'attributes',
            id: 'attributes',
            name: 'T20.Atributos',
            groups: [{ nestId: 'attributes_attributes', id: 'attributes', name: 'T20.Atributos', type: 'system' }]
        },
        {
            nestId: 'skills',
            id: 'skills',
            name: 'T20.Pericias',
            groups: [{ nestId: 'skills_skills', id: 'skills', name: 'T20.Pericias', type: 'system' }]
        },
        {
            nestId: 'inventory',
            id: 'inventory',
            name: 'T20.Inventario',
            groups: [
                { nestId: 'inventory_weapons', id: 'weapons', name: 'T20.Armas', type: 'system' },
                { nestId: 'inventory_equipment', id: 'equipment', name: 'T20.Equipamento', type: 'system' },
                { nestId: 'inventory_consumables', id: 'consumables', name: 'T20.Consumiveis', type: 'system' }
            ]
        },
        {
            nestId: 'spells',
            id: 'spells',
            name: 'T20.Magias',
            groups: [
                { nestId: 'spells_1', id: 'spells_1', name: 'T20.Magias1', type: 'system' },
                { nestId: 'spells_2', id: 'spells_2', name: 'T20.Magias2', type: 'system' },
                { nestId: 'spells_3', id: 'spells_3', name: 'T20.Magias3', type: 'system' },
                { nestId: 'spells_4', id: 'spells_4', name: 'T20.Magias4', type: 'system' },
                { nestId: 'spells_5', id: 'spells_5', name: 'T20.Magias5', type: 'system' }
            ]
        },
        {
            nestId: 'powers',
            id: 'powers',
            name: 'T20.Poderes',
            groups: [
                { nestId: 'powers_class', id: 'powers_class', name: 'T20.PoderesClasse', type: 'system' },
                { nestId: 'powers_general', id: 'powers_general', name: 'T20.PoderesGeral', type: 'system' },
                { nestId: 'powers_origin', id: 'powers_origin', name: 'T20.PoderesOrigem', type: 'system' },
                { nestId: 'powers_tormenta', id: 'powers_tormenta', name: 'T20.PoderesTormenta', type: 'system' },
                { nestId: 'powers_destiny', id: 'powers_destiny', name: 'T20.PoderesDestino', type: 'system' },
                { nestId: 'powers_other', id: 'powers_other', name: 'T20.PoderesOutros', type: 'system' }
            ]
        },
        {
            nestId: 'conditions',
            id: 'conditions',
            name: 'T20.Condicoes',
            groups: [{ nestId: 'conditions_conditions', id: 'conditions', name: 'T20.Condicoes', type: 'system' }]
        },
        {
            nestId: 'utility',
            id: 'utility',
            name: 'tokenActionHud.utility',
            groups: [
                { nestId: 'utility_utility', id: 'utility', name: 'tokenActionHud.utility', type: 'system' }
            ]
        }
    ],
    groups: [
        { id: 'attributes', name: 'T20.Atributos', type: 'system' },
        { id: 'skills', name: 'T20.Pericias', type: 'system' },
        { id: 'weapons', name: 'T20.Armas', type: 'system' },
        { id: 'equipment', name: 'T20.Equipamento', type: 'system' },
        { id: 'consumables', name: 'T20.Consumiveis', type: 'system' },
        { id: 'spells_1', name: '1º Círculo', type: 'system' },
        { id: 'spells_2', name: '2º Círculo', type: 'system' },
        { id: 'spells_3', name: '3º Círculo', type: 'system' },
        { id: 'spells_4', name: '4º Círculo', type: 'system' },
        { id: 'spells_5', name: '5º Círculo', type: 'system' },
        { id: 'powers_class', name: 'Classe', type: 'system' },
        { id: 'powers_general', name: 'Geral', type: 'system' },
        { id: 'powers_origin', name: 'Origem', type: 'system' },
        { id: 'powers_tormenta', name: 'Tormenta', type: 'system' },
        { id: 'powers_destiny', name: 'Destino', type: 'system' },
        { id: 'powers_other', name: 'Outros', type: 'system' },
        { id: 'conditions', name: 'T20.Condicoes', type: 'system' },
        { id: 'utility', name: 'tokenActionHud.utility', type: 'system' }
    ]
};
