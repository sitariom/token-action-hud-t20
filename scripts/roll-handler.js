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
                        if (actor.setupAtributo) {
                            actor.setupAtributo(actionId);
                        } else if (actor.rollAtributo) {
                            actor.rollAtributo(actionId);
                        } else {
                            Logger.error("Could not find attribute roll method on actor.");
                        }
                        break;
                    case 'skill':
                        if (actor.setupPericia) {
                            actor.setupPericia(actionId);
                        } else if (actor.rollPericia) {
                            actor.rollPericia(actionId);
                        } else {
                            Logger.error("Could not find skill roll method on actor.");
                        }
                        break;
                    case 'item':
                        const item = actor.items.get(actionId);
                        if (item) {
                            if (item.use) {
                                item.use();
                            } else if (item.roll) {
                                item.roll();
                            } else {
                                // Fallback to sheet render if no use method
                                item.sheet.render(true);
                            }
                        } else {
                            Logger.error(`Item ${actionId} not found on actor.`);
                        }
                        break;
                    case 'condition':
                        // Handle conditions
                        // Try to find token first
                        const token = canvas.tokens.get(actor.token?.id) || canvas.tokens.placeables.find(t => t.actor?.id === actor.id);
                        if (token) {
                            await token.toggleEffect(actionId);
                        } else {
                             // Fallback to actor method if available
                            if (actor.toggleStatusEffect) {
                                await actor.toggleStatusEffect(actionId);
                            } else {
                                Logger.error("Could not toggle status effect, no token or actor method found.");
                            }
                        }
                        break;
                }
            } catch (e) {
                Logger.error("Error executing macro", e);
            }
        }
    };
}
