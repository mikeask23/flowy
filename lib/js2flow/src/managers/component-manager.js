const { v4: uuidv4 } = require('uuid');

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.idCounter = 0;
    }

    createComponent(type, properties = {}, position = { x: 0, y: 0 }) {
        const component = {
            id: this.generateComponentId(type),
            type: type,
            name: properties.name || '',
            props: properties,
            position,
            connections: []
        };
        this.components.set(component.id, component);
        return component;
    }

    generateComponentId(type) {
        return `${type}_${this.idCounter++}_${uuidv4().slice(0, 8)}`;
    }

    getComponent(id) {
        return this.components.get(id);
    }

    getAllComponents() {
        return Array.from(this.components.values());
    }

    addConnection(sourceId, targetId, socketType = 'default') {
        const component = this.components.get(sourceId);
        if (component) {
            component.connections.push({
                id: targetId,
                type: socketType
            });
        }
    }
}

module.exports = ComponentManager;
