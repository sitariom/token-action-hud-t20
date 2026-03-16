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
                    let label = game.i18n.localize(`T20.Atributos.${key}`);
                    if (label.startsWith("T20.Atributos.")) { 
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
                         if (CONFIG.T20?.pericias && CONFIG.T20.pericias[key]) {
                             label = CONFIG.T20.pericias[key];
                         } else {
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
                // Ensure items is an array (V11+ Collection fix)
                const items = actor.items.contents || Array.from(actor.items);
                
                const weapons = items.filter(i => i.type === 'arma');
                this._addActionsToGroup(weapons, 'weapons');

                const equipment = items.filter(i => i.type === 'equipamento');
                this._addActionsToGroup(equipment, 'equipment');

                const consumables = items.filter(i => i.type === 'consumivel');
                this._addActionsToGroup(consumables, 'consumables');

                const spells = items.filter(i => i.type === 'magia');
                this._addActionsToGroup(spells, 'spells');

                const powers = items.filter(i => i.type === 'poder');
                this._addActionsToGroup(powers, 'powers');
            } catch (e) {
                Logger.error("Error building items", e);
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
