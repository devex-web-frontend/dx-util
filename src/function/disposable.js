/**
 * @param {class} target
 * @returns {class}
 */
export function DISPOSABLE(target) {
	/**
	 * @param {Array.<Function>} disposables
	 * @protected
	 */
	target.prototype._using = function(disposables) {
		/**
		 * @type {Array.<Function>}
		 * @private
		 */
		this._disposables = (this._disposables || []).concat(disposables);
	};

	/**
	 * Dispose
	 */
	target.prototype.dispose = function() {
		while (this._disposables.length !== 0) {
			this._disposables.pop()();
		}
	};

	return target;
}