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
                this._buildConditions(actor); // New method for conditions

                Logger.info("System actions built successfully.");
            } catch (e) {
                Logger.error("Error building system actions", e);
            }
        }

        _buildAttributes(actor) {
            try {
                const attributes = actor.system.atributos;
                if (!attributes) return;

                const actions = Object.entries(attributes).map(([key, attr]) => {
                    // Try to get the label from CONFIG if available, otherwise fallback to key
                    const label = game.i18n.localize(`T20.Atributos.${key}`) || 
                                  (CONFIG.T20?.atributos ? CONFIG.T20.atributos[key] : key.toUpperCase());
                    
                    return {
                        id: key,
                        name: label,
                        encodedValue: ['attribute', key].join('|'),
                        info1: { text: attr.value }
                    };
                });

                this.addActions(actions, { id: 'attributes', type: 'system' });
            } catch (e) {
                Logger.error("Error building attributes", e);
            }
        }

        _buildSkills(actor) {
            try {
                const skills = actor.system.pericias;
                if (!skills) return;

                const actions = Object.entries(skills).map(([key, skill]) => {
                    // Try to get the label from CONFIG if available
                    const label = game.i18n.localize(`T20.Pericias.${key}`) || 
                                  (CONFIG.T20?.pericias ? CONFIG.T20.pericias[key] : key);

                    return {
                        id: key,
                        name: label,
                        encodedValue: ['skill', key].join('|'),
                        info1: { text: skill.total }
                    };
                });

                this.addActions(actions, { id: 'skills', type: 'system' });
            } catch (e) {
                Logger.error("Error building skills", e);
            }
        }

        _buildItems(actor) {
            try {
                // Weapons
                const weapons = actor.items.filter(i => i.type === 'arma');
                this._addActionsToGroup(weapons, 'weapons');

                // Equipment
                const equipment = actor.items.filter(i => i.type === 'equipamento');
                this._addActionsToGroup(equipment, 'equipment');

                // Consumables
                const consumables = actor.items.filter(i => i.type === 'consumivel');
                this._addActionsToGroup(consumables, 'consumables');

                // Spells - Categorized by Circle
                const spells = actor.items.filter(i => i.type === 'magia');
                spells.forEach(spell => {
                    const circle = spell.system.circulo || '0'; // Default to 0 or check structure
                    const groupId = `spells_${circle}`;
                    // Verify if group exists in defaults, otherwise put in spells_1 or create dynamic?
                    // For now, we assume 1-5 circles.
                    if (['1', '2', '3', '4', '5'].includes(String(circle))) {
                         this._addActionsToGroup([spell], groupId);
                    } else {
                         // Fallback for 0 or undefined
                         this._addActionsToGroup([spell], 'spells_1');
                    }
                });

                // Powers - Categorized by Type
                const powers = actor.items.filter(i => i.type === 'poder');
                powers.forEach(power => {
                    const subtype = power.system.subtipo || 'other'; // classe, geral, origem, tormenta, destino
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
                    const name = game.i18n.localize(condition.label);
                    // Check if actor has this condition
                    const isActive = actor.effects.some(e => e.statuses.has(id));
                    
                    return {
                        id: id,
                        name: name,
                        encodedValue: ['condition', id].join('|'),
                        img: condition.icon,
                        cssClass: isActive ? 'active' : ''
                    };
                });
                
                this.addActions(actions, { id: 'conditions', type: 'system' });
            } catch (e) {
                Logger.error("Error building conditions", e);
            }
        }

        _addActionsToGroup(items, groupId) {
            if (!items.length) return;
            const actions = items.map(i => ({
                id: i.id,
                name: i.name,
                encodedValue: ['item', i.id].join('|'),
                img: i.img
            }));
            this.addActions(actions, { id: groupId, type: 'system' });
        }
    };
}
