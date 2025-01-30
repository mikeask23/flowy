class ErrorCode {
    static get CYCLIC_DEPENDENCY() { return 'CYCLIC_DEPENDENCY'; }
    static get UNRESOLVED_IDENTIFIER() { return 'UNRESOLVED_IDENTIFIER'; }
    static get INVALID_CONNECTION() { return 'INVALID_CONNECTION'; }
    static get UNSUPPORTED_SYNTAX() { return 'UNSUPPORTED_SYNTAX'; }
}

class ConversionError extends Error {
    constructor(code, message, node) {
        super(message);
        this.code = code;
        this.node = node;
        this.position = node?.loc?.start || { line: 0, column: 0 };
    }
}

class ErrorReporter {
    constructor() {
        this.errors = [];
        this.warnings = [];
    }

    reportError(code, message, node) {
        this.errors.push(new ConversionError(code, message, node));
    }

    reportWarning(code, message, node) {
        this.warnings.push(new ConversionError(code, message, node));
    }

    hasErrors() {
        return this.errors.length > 0;
    }

    formatErrors() {
        return this.errors.map(err => 
            `[${err.code}] ${err.message} at ${err.position.line}:${err.position.column}`
        ).join('\n');
    }
}

module.exports = { ErrorCode, ConversionError, ErrorReporter };
