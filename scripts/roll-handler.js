import { Logger } from './constants.js';

export function getRollHandler(coreModule) {
    return class RollHandler extends coreModule.api.RollHandler {
        async handleActionClick(event, encodedValue) {
            Logger.info(`Handling action event: ${encodedValue}`);
            try {
                const payload = encodedValue.split('|');
                if (payload.length !== 2) {
                    super.throwInvalidValueErr();
                }

                const actionType = payload[0];
                const actionId = payload[1];

                if (!this.actor) {
                    for (const token of canvas.tokens.controlled) {
                        const actor = token.actor;
                        await this._handleMacro(event, actionType, actionId, actor);
                    }
                } else {
                    await this._handleMacro(event, actionType, actionId, this.actor);
                }
            } catch (e) {
                Logger.error("Error handling action event", e);
            }
        }

        async _handleMacro(event, actionType, actionId, actor) {
            try {
                switch (actionType) {
                    case 'attribute':
                        if (!await this._executeFirstAvailable(actor, ['rollAtributo', 'setupAtributo'], [actionId])) {
                            if (game.tormenta20?.rollAttribute) {
                                await game.tormenta20.rollAttribute(actor, actionId);
                            } else {
                                ui.notifications?.warn(`Não foi possível rolar o atributo ${actionId}.`);
                            }
                            Logger.error("Could not find attribute roll method on actor.");
                        }
                        break;
                    case 'skill':
                        if (!await this._executeFirstAvailable(actor, ['rollPericia', 'setupPericia'], [actionId])) {
                            if (game.tormenta20?.rollSkill) {
                                await game.tormenta20.rollSkill(actor, actionId);
                            } else {
                                ui.notifications?.warn(`Não foi possível rolar a perícia ${actionId}.`);
                            }
                            Logger.error("Could not find skill roll method on actor.");
                        }
                        break;
                    case 'condition':
                        if (!await this._executeFirstAvailable(actor, ['toggleStatusEffect', 'toggleEffect'], [actionId])) {
                            Logger.error(`Could not toggle condition ${actionId}.`);
                        }
                        break;
                    case 'item':
                        const item = actor.items.get(actionId);
                        if (item) {
                            if (item.use) {
                                await item.use();
                            } else if (item.roll) {
                                await item.roll();
                            } else {
                                await item.sheet.render(true);
                            }
                        } else {
                            Logger.error(`Item ${actionId} not found on actor.`);
                        }
                        break;
                }
            } catch (e) {
                Logger.error("Error executing macro", e);
            }
        }

        async _executeFirstAvailable(target, methodNames, args = []) {
            for (const methodName of methodNames) {
                const method = target?.[methodName];
                if (typeof method === 'function') {
                    await method.apply(target, args);
                    return true;
                }
            }

            return false;
        }
    };
}
