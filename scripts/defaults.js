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
            groups: [{ nestId: 'spells_spells', id: 'spells', name: 'T20.Magias', type: 'system' }]
        },
        {
            nestId: 'powers',
            id: 'powers',
            name: 'T20.Poderes',
            groups: [{ nestId: 'powers_powers', id: 'powers', name: 'T20.Poderes', type: 'system' }]
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
        { id: 'spells', name: 'T20.Magias', type: 'system' },
        { id: 'powers', name: 'T20.Poderes', type: 'system' },
        { id: 'conditions', name: 'T20.Condicoes', type: 'system' }
    ]
};
