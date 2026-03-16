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
                { nestId: 'inventory_consumables', id: 'consumables', name: 'T20.Consumiveis', type: 'system' },
                { nestId: 'inventory_treasures', id: 'treasures', name: 'T20.Tesouros', type: 'system' }
            ]
        },
        {
            nestId: 'spells',
            id: 'spells',
            name: 'T20.Magias',
            groups: [{ nestId: 'spells_spells', id: 'spells', name: 'T20.Magias', type: 'system' }]
        },
        {
            nestId: 'powers',
            id: 'powers',
            name: 'T20.Poderes',
            groups: [
                { nestId: 'powers_class', id: 'powers_class', name: 'Classe', type: 'system' },
                { nestId: 'powers_granted', id: 'powers_granted', name: 'Concedido', type: 'system' },
                { nestId: 'powers_destiny', id: 'powers_destiny', name: 'Destino', type: 'system' },
                { nestId: 'powers_distinction', id: 'powers_distinction', name: 'Distinção', type: 'system' },
                { nestId: 'powers_racial', id: 'powers_racial', name: 'Racial', type: 'system' },
                { nestId: 'powers_general', id: 'powers_general', name: 'Geral', type: 'system' },
                { nestId: 'powers_ability', id: 'powers_ability', name: 'Ability', type: 'system' },
                { nestId: 'powers_other', id: 'powers_other', name: 'Outros', type: 'system' }
            ]
        },
        {
            nestId: 'conditions',
            id: 'conditions',
            name: 'T20.Condicoes',
            groups: [{ nestId: 'conditions_conditions', id: 'conditions', name: 'T20.Condicoes', type: 'system' }]
        }
    ],
    groups: [
        { id: 'attributes', name: 'T20.Atributos', type: 'system' },
        { id: 'skills', name: 'T20.Pericias', type: 'system' },
        { id: 'weapons', name: 'T20.Armas', type: 'system' },
        { id: 'equipment', name: 'T20.Equipamento', type: 'system' },
        { id: 'consumables', name: 'T20.Consumiveis', type: 'system' },
        { id: 'treasures', name: 'T20.Tesouros', type: 'system' },
        { id: 'spells', name: 'T20.Magias', type: 'system' },
        { id: 'powers_class', name: 'Classe', type: 'system' },
        { id: 'powers_granted', name: 'Concedido', type: 'system' },
        { id: 'powers_destiny', name: 'Destino', type: 'system' },
        { id: 'powers_distinction', name: 'Distinção', type: 'system' },
        { id: 'powers_racial', name: 'Racial', type: 'system' },
        { id: 'powers_general', name: 'Geral', type: 'system' },
        { id: 'powers_ability', name: 'Ability', type: 'system' },
        { id: 'powers_other', name: 'Outros', type: 'system' },
        { id: 'conditions', name: 'T20.Condicoes', type: 'system' }
    ]
};
