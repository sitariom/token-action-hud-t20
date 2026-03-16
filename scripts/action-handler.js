import { Logger } from './constants.js';

export function getActionHandler(coreModule) {
    return class ActionHandler extends coreModule.api.ActionHandler {
        async buildSystemActions(groupIds) {
            Logger.info("Building system actions...");
            try {
                const token = this.token;
                if (!token) return;
                const actor = this.actor;
                if (!actor) return;

                if (!['character', 'npc', 'threat'].includes(actor.type)) {
                    Logger.info(`Actor type ${actor.type} not supported or no actions defined.`);
                    return;
                }

                this._buildAttributes(actor);
                this._buildSkills(actor);
                this._buildItems(actor);
                this._buildConditions(actor);

                Logger.info("System actions built successfully.");
            } catch (e) {
                Logger.error("Error building system actions", e);
            }
        }

        _buildAttributes(actor) {
            try {
                // Baseado no JSON fornecido: atributos.for.value, atributos.des.value, etc.
                const attributes = actor.system.atributos;
                if (!attributes) return;

                const attrMap = {
                    'for': 'Força',
                    'des': 'Destreza',
                    'con': 'Constituição',
                    'int': 'Inteligência',
                    'sab': 'Sabedoria',
                    'car': 'Carisma'
                };

                const actions = Object.entries(attributes).map(([key, attr]) => {
                    let label = game.i18n.localize(`T20.Atributos.${key}`);
                    if (label.startsWith("T20.Atributos.")) { 
                        label = attrMap[key] || key.toUpperCase();
                    }
                    
                    return {
                        id: `attribute_${key}`,
                        name: label,
                        encodedValue: ['attribute', key].join('|'),
                        info1: { text: attr.value },
                        listName: `Atributo: ${label}`
                    };
                });

                this.addActions(actions, { id: 'attributes', type: 'system' });
            } catch (e) {
                Logger.error("Error building attributes", e);
            }
        }

        _buildSkills(actor) {
            try {
                // Baseado no JSON fornecido: pericias.acro.total, pericias.ades.total, etc.
                const skills = actor.system.pericias;
                if (!skills) return;

                const actions = Object.entries(skills).map(([key, skill]) => {
                    let label = game.i18n.localize(`T20.Pericias.${key}`);
                    if (label.startsWith("T20.Pericias.")) {
                         if (CONFIG.T20?.pericias && CONFIG.T20.pericias[key]) {
                             label = CONFIG.T20.pericias[key];
                         } else {
                             label = key.charAt(0).toUpperCase() + key.slice(1);
                         }
                    }

                    return {
                        id: `skill_${key}`,
                        name: label,
                        encodedValue: ['skill', key].join('|'),
                        info1: { text: skill.total },
                        listName: `Perícia: ${label}`
                    };
                });

                this.addActions(actions, { id: 'skills', type: 'system' });
            } catch (e) {
                Logger.error("Error building skills", e);
            }
        }

        _buildItems(actor) {
            try {
                // Foundry V11+ Collection fix
                const items = actor.items.contents || Array.from(actor.items);
                
                // Categorias
                const weapons = items.filter(i => i.type === 'arma');
                const equipment = items.filter(i => i.type === 'equipamento');
                const consumables = items.filter(i => i.type === 'consumivel');
                const spells = items.filter(i => i.type === 'magia');
                const powers = items.filter(i => i.type === 'poder');

                this._addActionsToGroup(weapons, 'weapons');
                this._addActionsToGroup(equipment, 'equipment');
                this._addActionsToGroup(consumables, 'consumables');

                // Magias separadas por Círculo
                spells.forEach(spell => {
                    const circle = String(spell.system?.circulo || '1');
                    let groupId = `spells_${circle}`;
                    if (!['1', '2', '3', '4', '5'].includes(circle)) groupId = 'spells_1';
                    this._addActionsToGroup([spell], groupId);
                });

                // Poderes separados por Subtipo
                powers.forEach(power => {
                    const subtype = String(power.system?.subtipo || 'other').toLowerCase();
                    let groupId = 'powers_other';
                    if (['classe', 'class'].includes(subtype)) groupId = 'powers_class';
                    else if (['geral', 'general'].includes(subtype)) groupId = 'powers_general';
                    else if (['origem', 'origin'].includes(subtype)) groupId = 'powers_origin';
                    else if (['tormenta'].includes(subtype)) groupId = 'powers_tormenta';
                    else if (['destino', 'destiny'].includes(subtype)) groupId = 'powers_destiny';
                    this._addActionsToGroup([power], groupId);
                });

            } catch (e) {
                Logger.error("Error building items", e);
            }
        }
        
        _buildConditions(actor) {
            try {
                const conditions = CONFIG.statusEffects || [];
                if (!conditions.length) return;

                const actions = conditions.map(condition => {
                    const id = condition.id;
                    const name = game.i18n.localize(condition.label || condition.name); 
                    
                    const isActive = actor.effects.some(e => 
                        e.statuses?.has(id) || 
                        e.flags?.core?.statusId === id
                    );
                    
                    return {
                        id: `condition_${id}`,
                        name: name,
                        encodedValue: ['condition', id].join('|'),
                        img: condition.icon,
                        cssClass: isActive ? 'active' : '',
                        listName: `Condição: ${name}`
                    };
                });
                
                this.addActions(actions, { id: 'conditions', type: 'system' });
            } catch (e) {
                Logger.error("Error building conditions", e);
            }
        }

        _addActionsToGroup(items, groupId) {
            if (!items || !items.length) return;
            const actions = items.map(i => ({
                id: `item_${i.id}`,
                name: i.name,
                encodedValue: ['item', i.id].join('|'),
                img: i.img,
                listName: `Item: ${i.name}`
            }));
            this.addActions(actions, { id: groupId, type: 'system' });
        }
    };
}
