export function DISPOSABLE(target: any) {
	/**
	 * @param {Array.<Function>} disposables
	 * @protected
	 */
	target.prototype._using = function (disposables: Function[]) {
		/**
		 * @type {Array.<Function>}
		 * @private
		 */
		this._disposables = (this._disposables || []).concat(disposables);
	};

	/**
	 * Dispose
	 */
	target.prototype.dispose = function () {
		while (this._disposables.length !== 0) {
			this._disposables.pop()();
		}
	};

	return target;
}