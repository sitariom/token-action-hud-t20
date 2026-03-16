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
                    // Tenta tradução oficial, fallback para mapa manual, fallback para chave capitalizada
                    let label = game.i18n.localize(`T20.Atributos.${key}`);
                    if (label.startsWith("T20.Atributos.")) { // Translation failed
                        label = attrMap[key] || key.toUpperCase();
                    }
                    
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
                    let label = game.i18n.localize(`T20.Pericias.${key}`);
                    if (label.startsWith("T20.Pericias.")) {
                         // Try CONFIG fallback if available
                         if (CONFIG.T20?.pericias && CONFIG.T20.pericias[key]) {
                             label = CONFIG.T20.pericias[key];
                         } else {
                             // Capitalize first letter as last resort
                             label = key.charAt(0).toUpperCase() + key.slice(1);
                         }
                    }

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
                const items = actor.items; // Cache items access
                
                // Weapons
                const weapons = items.filter(i => i.type === 'arma');
                this._addActionsToGroup(weapons, 'weapons');

                // Equipment
                const equipment = items.filter(i => i.type === 'equipamento');
                this._addActionsToGroup(equipment, 'equipment');

                // Consumables
                const consumables = items.filter(i => i.type === 'consumivel');
                this._addActionsToGroup(consumables, 'consumables');

                // Spells
                const spells = items.filter(i => i.type === 'magia');
                spells.forEach(spell => {
                    const circle = String(spell.system.circulo || '1'); // Force string and default to 1
                    // Ensure circle is 1-5, otherwise clamp or default
                    let groupId = `spells_${circle}`;
                    if (!['1', '2', '3', '4', '5'].includes(circle)) {
                        groupId = 'spells_1';
                    }
                    this._addActionsToGroup([spell], groupId);
                });

                // Powers
                const powers = items.filter(i => i.type === 'poder');
                powers.forEach(power => {
                    const subtype = power.system.subtipo || 'other'; 
                    // Normalize subtype to lowercase for comparison
                    const subtypeLower = String(subtype).toLowerCase();
                    
                    let groupId = 'powers_other';
                    if (['classe', 'class'].includes(subtypeLower)) groupId = 'powers_class';
                    else if (['geral', 'general'].includes(subtypeLower)) groupId = 'powers_general';
                    else if (['origem', 'origin'].includes(subtypeLower)) groupId = 'powers_origin';
                    else if (['tormenta'].includes(subtypeLower)) groupId = 'powers_tormenta';
                    else if (['destino', 'destiny'].includes(subtypeLower)) groupId = 'powers_destiny';

                    this._addActionsToGroup([power], groupId);
                });

            } catch (e) {
                Logger.error("Error building items", e);
            }
        }
        
        _buildConditions(actor) {
            try {
                // Foundry V11+ usually populates CONFIG.statusEffects
                const conditions = CONFIG.statusEffects || [];
                
                if (!conditions.length) {
                    Logger.info("No conditions found in CONFIG.statusEffects.");
                    return;
                }

                const actions = conditions.map(condition => {
                    const id = condition.id;
                    const name = game.i18n.localize(condition.label); // localize label
                    
                    // Check active effects on actor
                    // V11: actor.effects.some(e => e.statuses.has(id))
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
            if (!items || !items.length) return;
            
            const actions = items.map(i => ({
                id: i.id,
                name: i.name,
                encodedValue: ['item', i.id].join('|'),
                img: i.img
            }));
            
            // Check if group exists before adding? HUD Core handles it, but good to be safe.
            this.addActions(actions, { id: groupId, type: 'system' });
        }
    };
}
