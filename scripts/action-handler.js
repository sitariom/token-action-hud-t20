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

                const actions = Object.entries(attributes).map(([key, attr]) => {
                    return {
                        id: `attribute_${key}`,
                        name: this._getAttributeName(key, attr),
                        encodedValue: ['attribute', key].join('|'),
                        info1: { text: attr?.value ?? attr?.total ?? '-' }
                    };
                });

                actions.sort((a, b) => a.name.localeCompare(b.name));
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
                    return {
                        id: `skill_${key}`,
                        name: this._getSkillName(key, skill),
                        encodedValue: ['skill', key].join('|'),
                        info1: { text: skill?.value ?? skill?.total ?? '-' }
                    };
                });

                actions.sort((a, b) => a.name.localeCompare(b.name));
                this.addActions(actions, { id: 'skills', type: 'system' });
            } catch (e) {
                Logger.error("Error building skills", e);
            }
        }

        _buildItems(actor) {
            try {
                const items = actor?.items?.contents ?? Array.from(actor?.items ?? []);
                const weapons = items.filter(i => i.type === 'arma');
                this._addActionsToGroup(weapons, 'weapons', i => this._getItemAction(i));

                const equipment = items.filter(i => i.type === 'equipamento');
                this._addActionsToGroup(equipment, 'equipment', i => this._getItemAction(i));

                const consumables = items.filter(i => i.type === 'consumivel');
                this._addActionsToGroup(consumables, 'consumables', i => this._getItemAction(i));

                const treasures = items.filter(i => ['tesouro', 'treasure', 'item'].includes(i.type));
                this._addActionsToGroup(treasures, 'treasures', i => this._getItemAction(i));

                const spells = items.filter(i => i.type === 'magia');
                this._addActionsToGroup(spells, 'spells', i => this._getSpellAction(i));

                const powers = items.filter(i => i.type === 'poder');
                this._addActionsToGroup(powers, 'powers', i => this._getPowerAction(i));
            } catch (e) {
                Logger.error("Error building items", e);
            }
        }

        _buildConditions(actor) {
            try {
                const conditions = CONFIG.statusEffects;
                if (!conditions?.length) return;

                const actions = conditions.map(condition => {
                    const id = condition.id ?? condition.label;
                    const localizedLabel = game.i18n.localize(condition.label);

                    return {
                        id: `condition_${id}`,
                        name: localizedLabel === condition.label ? String(id) : localizedLabel,
                        encodedValue: ['condition', id].join('|'),
                        img: condition.icon
                    };
                });

                actions.sort((a, b) => a.name.localeCompare(b.name));
                this.addActions(actions, { id: 'conditions', type: 'system' });
            } catch (e) {
                Logger.error("Error building conditions", e);
            }
        }

        _addActionsToGroup(items, groupId, mapAction) {
            if (!items.length) return;

            const sortedItems = [...items].sort((a, b) => {
                if (groupId === 'spells') {
                    const circleA = this._getSpellCircle(a);
                    const circleB = this._getSpellCircle(b);
                    if (circleA !== circleB) return circleA - circleB;
                }
                return String(a?.name ?? '').localeCompare(String(b?.name ?? ''));
            });

            const actions = sortedItems.map(item => mapAction(item));
            this.addActions(actions, { id: groupId, type: 'system' });
        }

        _getItemAction(item) {
            return {
                id: item.id,
                name: item.name,
                encodedValue: ['item', item.id].join('|'),
                img: item.img
            };
        }

        _getSpellAction(item) {
            return {
                id: item.id,
                name: item.name,
                encodedValue: ['item', item.id].join('|'),
                img: item.img,
                info1: { text: this._getSpellType(item) }
            };
        }

        _getPowerAction(item) {
            return {
                id: item.id,
                name: item.name,
                encodedValue: ['item', item.id].join('|'),
                img: item.img,
                info1: { text: this._getPowerType(item) }
            };
        }

        _getAttributeName(key, attribute) {
            if (attribute?.label) return String(attribute.label);
            if (CONFIG.T20?.atributos?.[key]) return String(CONFIG.T20.atributos[key]);

            const localized = game.i18n.localize(`T20.Atributos.${key}`);
            if (localized !== `T20.Atributos.${key}`) return localized;

            const fallbackMap = {
                for: 'Força',
                des: 'Destreza',
                con: 'Constituição',
                int: 'Inteligência',
                sab: 'Sabedoria',
                car: 'Carisma'
            };

            return fallbackMap[key] ?? String(key).toUpperCase();
        }

        _getSkillName(key, skill) {
            if (skill?.label) return String(skill.label);
            if (CONFIG.T20?.pericias?.[key]) return String(CONFIG.T20.pericias[key]);

            const localized = game.i18n.localize(`T20.Pericias.${key}`);
            if (localized !== `T20.Pericias.${key}`) return localized;

            return String(key).charAt(0).toUpperCase() + String(key).slice(1);
        }

        _getSpellType(item) {
            const circle = this._getSpellCircle(item);
            const school = item?.system?.escola;
            const schoolLabel = school ? String(school) : '';

            if (schoolLabel) return `Círculo ${circle} • ${schoolLabel}`;
            return `Círculo ${circle}`;
        }

        _getSpellCircle(item) {
            const rawCircle =
                item?.system?.circulo ??
                item?.system?.circle ??
                item?.system?.nivel ??
                item?.system?.level;

            if (typeof rawCircle === 'number' && Number.isFinite(rawCircle)) {
                return rawCircle;
            }

            if (typeof rawCircle === 'string') {
                const match = rawCircle.match(/\d+/);
                if (match) return Number(match[0]);
            }

            if (rawCircle && typeof rawCircle === 'object') {
                const candidates = [rawCircle.value, rawCircle.total, rawCircle.current, rawCircle.base];
                for (const candidate of candidates) {
                    if (typeof candidate === 'number' && Number.isFinite(candidate)) return candidate;
                    if (typeof candidate === 'string') {
                        const match = candidate.match(/\d+/);
                        if (match) return Number(match[0]);
                    }
                }
            }

            return 0;
        }

        _getPowerType(item) {
            const type = item?.system?.tipo ?? item?.system?.categoria ?? item?.type;
            return String(type ?? 'Poder');
        }
    };
}
